import { AxiosInstance } from 'axios';
import { Version3Client } from 'jira.js';
import { Alert } from 'react-native';
import { jiraAuthsAtom, jiraClientsAtom, store } from '../atoms';
import { refreshAccessToken } from '../services/jira-auth.service';
import { JiraAuthModel } from '../services/storage.service';

export function createJiraClient(jiraAuth: JiraAuthModel, accountId: string): Version3Client {
  const jiraClient = new Version3Client({ host: 'https://example.com' });
  // @ts-expect-error (we are accessing a private property here, but it's the only way to access the underlying Axios instance)
  const axiosInstance = jiraClient.instance as AxiosInstance;
  axiosInstance.interceptors.request.use(async config => addAccessTokenToRequest(config, jiraAuth));
  axiosInstance.interceptors.response.use(
    response => response,
    async error => handleAxiosError(axiosInstance, error, jiraAuth, accountId)
  );
  const newJiraClients = store.get(jiraClientsAtom);
  newJiraClients[accountId] = jiraClient;
  store.set(jiraClientsAtom, newJiraClients);
  return jiraClient;
}

/**
 * Injects the access token into the request.
 * We need to do this for every request because the access token might have change.
 */
export function addAccessTokenToRequest(config: any, jiraAuth: JiraAuthModel) {
  config.baseURL = `https://api.atlassian.com/ex/jira/${jiraAuth?.cloudId}`;
  if (jiraAuth?.accessToken) {
    config.headers.Authorization = `Bearer ${jiraAuth!.accessToken}`;
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
  jiraAuth: JiraAuthModel,
  accountId: string
) {
  const status = error.response ? error.response.status : null;

  if (status === 401) {
    if (!jiraAuth?.refreshToken) {
      return Promise.reject(error);
    }
    const jiraAuths = store.get(jiraAuthsAtom);

    try {
      const freshTokens = await refreshAccessToken(jiraAuth.refreshToken);
      // Update auth tokens for upcoming requests
      const newJiraAuths = store.get(jiraAuthsAtom);
      newJiraAuths[accountId] = {
        ...jiraAuth,
        accessToken: freshTokens.access_token,
        refreshToken: freshTokens.refresh_token,
      };
      store.set(jiraAuthsAtom, { ...newJiraAuths });
    } catch (err) {
      if ((err as Error).message === 'refresh_token is invalid') {
        // Refresh token has expired after 90 days, user needs to re-authenticate
        Alert.alert('Your session has expired!', 'Please log in again.');

        // Remove the accountId from the auths object
        // TODO: Add a way to re-authenticate
        delete jiraAuths[accountId];
        store.set(jiraAuthsAtom, { ...jiraAuths });
      } else {
        // Retrow unexpected errors
        throw err;
      }
    }

    return axiosInstance.request(error.config);
  }

  return Promise.reject(error);
}
