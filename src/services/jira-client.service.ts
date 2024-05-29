import { AxiosInstance } from 'axios';
import { Version3Client } from 'jira.js';
import { Alert } from 'react-native';
import {
  jiraAccountTokensAtom,
  jiraClientsAtom,
  loginsAtom,
  store,
  worklogsLocalAtom,
  worklogsLocalBackupsAtom,
} from '../atoms';
import { refreshAccessToken } from '../services/jira-auth.service';
import { CloudId, JiraAccountTokens, UUID } from '../types/accounts.types';
import { Worklog } from '../types/global.types';

export function createJiraClient(jiraAccountTokens: JiraAccountTokens, uuid: UUID, cloudId: CloudId): Version3Client {
  const jiraClient = new Version3Client({ host: 'https://example.com' });
  // @ts-expect-error (we are accessing a private property here, but it's the only way to access the underlying Axios instance)
  const axiosInstance = jiraClient.instance as AxiosInstance;
  axiosInstance.interceptors.request.use(async config => addAccessTokenToRequest(config, jiraAccountTokens, cloudId));
  axiosInstance.interceptors.response.use(
    response => response,
    async error => handleAxiosError(axiosInstance, error, jiraAccountTokens, uuid)
  );
  const newJiraClients = store.get(jiraClientsAtom);
  newJiraClients[uuid] = jiraClient;
  store.set(jiraClientsAtom, newJiraClients);
  return jiraClient;
}

/**
 * Injects the access token into the request.
 * We need to do this for every request because the access token might have change.
 */
export function addAccessTokenToRequest(config: any, jiraAccountTokens: JiraAccountTokens, cloudId: CloudId) {
  config.baseURL = `https://api.atlassian.com/ex/jira/${cloudId}`;
  if (jiraAccountTokens.accessToken) {
    config.headers.Authorization = `Bearer ${jiraAccountTokens.accessToken}`;
  }
  return config;
}

/**
 * Refreshes the access token if it has expired and retries the request.
 * Stores the new tokens in the auths object.
 */
export async function handleAxiosError(
  axiosInstance: AxiosInstance,
  error: any,
  jiraAccountTokens: JiraAccountTokens,
  uuid: UUID
) {
  const status = error.response ? error.response.status : null;

  if (status === 401) {
    if (!jiraAccountTokens?.refreshToken) {
      return Promise.reject(error);
    }
    const jiraAuths = store.get(jiraAccountTokensAtom);

    try {
      const freshTokens = await refreshAccessToken(jiraAccountTokens.refreshToken);
      // Update auth tokens for upcoming requests
      const newJiraAccountTokens = store.get(jiraAccountTokensAtom);
      newJiraAccountTokens[uuid] = {
        ...jiraAccountTokens,
        accessToken: freshTokens.access_token,
        refreshToken: freshTokens.refresh_token,
      };
      store.set(jiraAccountTokensAtom, { ...newJiraAccountTokens });
    } catch (err) {
      if ((err as Error).message === 'refresh_token is invalid') {
        // Refresh token has expired after 90 days, user needs to re-authenticate
        const jiraAccount = store.get(loginsAtom).find(account => account.accountId === uuid);
        Alert.alert(
          'Your session has expired!',
          `Please log in again as ${jiraAccount?.name} on the ${jiraAccount?.workspaceName} workspace.`
        );

        // Remove the accountId from the auths object and store local worklogs of account in backup storage
        const localWorklogs = store.get(worklogsLocalAtom);
        const newBackupWorklogs: Worklog[] = [];
        store.set(
          worklogsLocalAtom,
          localWorklogs.filter(worklog => {
            if (worklog.uuid === uuid) {
              newBackupWorklogs.push(worklog);
              return false;
            }
            return true;
          })
        );
        store.set(worklogsLocalBackupsAtom, cur => [...cur, ...newBackupWorklogs]);
        delete jiraAuths[uuid];
        store.set(jiraAccountTokensAtom, { ...jiraAuths });
      } else {
        // Rethrow unexpected errors
        throw err;
      }
    }

    return axiosInstance.request(error.config);
  }

  return Promise.reject(error);
}
