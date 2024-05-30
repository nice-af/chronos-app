import axios, { AxiosInstance } from 'axios';
import { Version3Models } from 'jira.js';
import { atom } from 'jotai';
import { Alert } from 'react-native';
import { store } from '../atoms';
import { colorKeys } from '../styles/theme/theme-types';
import { AccountId, CloudId, LoginModel, UUID } from '../types/accounts.types';
import { JiraResource } from '../types/jira.types';
import { refreshAccessToken } from './jira-auth.service';
import { getModalAccountSelection } from './modal.service';

/**
 * We need to temporarily store the tokens while we fetch the account data.
 * Tokens could change during the process and we can't use our regular auth store yet (accountId is missing)
 */
export const temporaryTokensAtom = atom<{ accessToken: string; refreshToken: string } | null>(null);

/**
 * Request remote info about the workspace, mainly the correct cloud id to connect to
 */
export async function requestWorkspaceInfo(
  axiosInstance: AxiosInstance,
  cloudId?: string
): Promise<JiraResource | null> {
  const resources = await axiosInstance
    .get<JiraResource[]>('https://api.atlassian.com/oauth/token/accessible-resources')
    .then(response => response.data);
  if (cloudId) {
    return resources.find(resource => resource.id === cloudId) ?? null;
  }
  if (resources.length === 1) {
    return resources[0];
  }
  const targetCloudId = await getModalAccountSelection({ jiraResources: resources });
  return resources.find(resource => resource.id === targetCloudId) ?? null;
}

/**
 * Request remote info about the user.
 * Jira.js does provide a method for this, but we need the information before we can create a client.
 */
export async function requestUserInfo(
  axiosInstance: AxiosInstance,
  cloudId: string
): Promise<Version3Models.User | null> {
  return await axiosInstance
    .get(`https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/myself`)
    .then(response => response.data);
}

/**
 * Get the account data for a given access token
 */
interface RequestAccountDataOptions {
  accessToken: string;
  refreshToken: string;
  cloudId?: string;
  currentLogin?: LoginModel;
}
interface RequestAccountDataReturn {
  login: LoginModel;
  accessToken: string;
  refreshToken: string;
}
export async function requestAccountData(data: RequestAccountDataOptions): Promise<RequestAccountDataReturn> {
  const { accessToken, refreshToken, cloudId, currentLogin } = data;
  store.set(temporaryTokensAtom, { accessToken, refreshToken });
  const axiosInstance = axios.create();
  axiosInstance.interceptors.request.use(async config => addAccessTokenToRequest(config));
  axiosInstance.interceptors.response.use(
    response => response,
    async error => handleAxiosError(axiosInstance, error)
  );

  const workspace = await requestWorkspaceInfo(axiosInstance, cloudId);
  if (!workspace) {
    Alert.alert('Could not access the selected workspace. Please try again.');
    throw new Error('Could not access the selected workspace. Please try again.');
  }
  const userInfo = await requestUserInfo(axiosInstance, workspace.id);
  if (!userInfo) {
    Alert.alert('Could not get user info. Please try again.');
    throw new Error('Could not get user info. Please try again.');
  }
  const tokens = store.get(temporaryTokensAtom);
  if (!tokens) {
    Alert.alert('Could not get tokens. Please try again.');
    throw new Error('Could not get tokens. Please try again.');
  }
  const newAccessToken = tokens.accessToken;
  const newRefreshToken = tokens.refreshToken;
  store.set(temporaryTokensAtom, null);

  return {
    login: {
      uuid: `${userInfo.accountId}__${workspace.id}` as UUID,
      accountId: userInfo.accountId as AccountId,
      cloudId: workspace.id as CloudId,
      name: userInfo.displayName ?? '',
      avatarUrl: userInfo.avatarUrls?.['48x48'] ?? '',
      workspaceName: workspace.name,
      workspaceDisplayName: currentLogin?.workspaceDisplayName ?? workspace.name,
      workspaceColor: currentLogin?.workspaceColor ?? colorKeys[Math.floor(Math.random() * colorKeys.length)],
      customWorkspaceColor: currentLogin?.customWorkspaceColor,
      isPrimary: currentLogin?.isPrimary ?? false,
    },
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
}

/**
 * Injects the access token into the request.
 * We need to do this for every request because the access token might have change.
 */
export function addAccessTokenToRequest(config: any) {
  const tokens = store.get(temporaryTokensAtom);
  if (tokens && tokens.accessToken) {
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
  }
  return config;
}

/**
 * Refreshes the access token if it has expired and retries the request.
 * Doesn't store the new tokens, only updates the request and retries it.
 */
export async function handleAxiosError(axiosInstance: AxiosInstance, error: any) {
  const status = error.response ? error.response.status : null;
  const tokens = store.get(temporaryTokensAtom);
  if (!tokens) {
    return Promise.reject(error);
  }

  if (status === 401) {
    try {
      const freshTokens = await refreshAccessToken(tokens.refreshToken);
      store.set(temporaryTokensAtom, {
        accessToken: freshTokens.access_token,
        refreshToken: freshTokens.refresh_token,
      });
    } catch (err) {
      if ((err as Error).message === 'refresh_token is invalid') {
        // Refresh token has expired after 90 days, user needs to re-authenticate
        Alert.alert('Your session has expired!', 'Please try to log in again.');
        store.set(temporaryTokensAtom, null);
      } else {
        // Rethrow unexpected errors
        throw err;
      }
    }

    return axiosInstance.request(error.config);
  }

  return Promise.reject(error);
}
