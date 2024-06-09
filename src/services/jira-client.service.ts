import { AxiosInstance } from 'axios';
import { Version3Client } from 'jira.js';
import { Alert } from 'react-native';
import {
  addJiraClientToStore,
  getJiraAccountTokensByUUID,
  jiraAccountTokensAtom,
  loginsAtom,
  store,
  worklogsLocalAtom,
  worklogsLocalBackupsAtom,
} from '../atoms';
import { CloudId, UUID } from '../types/accounts.types';
import { Worklog } from '../types/global.types';
import { refreshAccessToken } from './jira-api-fetch';

/**
 * Creates a Jira client with the given credentials and adds it to the store.
 */
export async function createJiraClient(uuid: UUID, cloudId: CloudId) {
  const jiraClient = new Version3Client({ host: 'https://example.com' });
  // @ts-expect-error (we are accessing a private property here, but it's the only way to access the underlying Axios instance)
  const axiosInstance = jiraClient.instance as AxiosInstance;
  axiosInstance.interceptors.request.use(async config => addAccessTokenToRequest(config, uuid, cloudId));
  axiosInstance.interceptors.response.use(
    response => response,
    async error => handleAxiosError(axiosInstance, error, uuid)
  );
  addJiraClientToStore(uuid, jiraClient);
}

/**
 * Injects the access token into the request.
 * We need to do this for every request because the access token might have change.
 */
export function addAccessTokenToRequest(config: any, uuid: UUID, cloudId: CloudId) {
  config.baseURL = `https://api.atlassian.com/ex/jira/${cloudId}`;
  const jiraAccountTokens = getJiraAccountTokensByUUID(uuid);
  if (jiraAccountTokens.accessToken) {
    config.headers.Authorization = `Bearer ${jiraAccountTokens.accessToken}`;
  }
  return config;
}

/**
 * Refreshes the access token if it has expired and retries the request.
 * Stores the new tokens in the auths object.
 */
export async function handleAxiosError(axiosInstance: AxiosInstance, error: any, uuid: UUID) {
  const status = error.response ? error.response.status : null;

  if (status === 401) {
    const jiraAccountTokens = store.get(jiraAccountTokensAtom);
    if (!jiraAccountTokens[uuid]) {
      return Promise.reject(error);
    }

    try {
      const freshTokens = await refreshAccessToken(jiraAccountTokens[uuid].refreshToken);
      // Update auth tokens for upcoming requests
      const newJiraAccountTokens = store.get(jiraAccountTokensAtom);
      newJiraAccountTokens[uuid] = {
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
        delete jiraAccountTokens[uuid];
        store.set(jiraAccountTokensAtom, { ...jiraAccountTokens });
      } else {
        // Rethrow unexpected errors
        throw err;
      }
    }

    return axiosInstance.request(error.config);
  }

  return Promise.reject(error);
}
