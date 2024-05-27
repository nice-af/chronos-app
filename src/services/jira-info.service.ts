import axios, { AxiosInstance } from 'axios';
import { Version3Models } from 'jira.js';
import { atom } from 'jotai';
import { Alert } from 'react-native';
import { store } from '../atoms';
import { JiraResource } from '../types/auth.types';
import { refreshAccessToken } from './jira-auth.service';
import { JiraAccountModel } from './storage.service';
import getLuminance from 'polished/lib/color/getLuminance';
import { setLightness } from 'polished';

/**
 * We need to temporarily store the tokens while we fetch the account data.
 * Tokens could change during the process and we can't use our regular auth store yet (accountId is missing)
 */
export const temporaryTokensAtom = atom<{ accessToken: string; refreshToken: string } | null>(null);

/**
 * Request remote info about the workspace, mainly the correct cloud id to connect to
 */
export async function requestWorkspaceInfo(axiosInstance: AxiosInstance): Promise<JiraResource | null> {
  return await axiosInstance
    .get<JiraResource[]>('https://api.atlassian.com/oauth/token/accessible-resources')
    // TODO @florianmrz how do we handle multiple resources?
    .then(response => response.data[0]);
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
interface RequestAccountDataReturn {
  jiraAccount: JiraAccountModel;
  workspace: JiraResource;
  userInfo: Version3Models.User;
  accessToken: string;
  refreshToken: string;
}
export async function requestAccountData(accessToken: string, refreshToken: string): Promise<RequestAccountDataReturn> {
  store.set(temporaryTokensAtom, { accessToken, refreshToken });
  const axiosInstance = axios.create();
  axiosInstance.interceptors.request.use(async config => addAccessTokenToRequest(config));
  axiosInstance.interceptors.response.use(
    response => response,
    async error => handleAxiosError(axiosInstance, error)
  );
  console.log(1);
  const workspace = await requestWorkspaceInfo(axiosInstance);
  if (!workspace) {
    throw new Error('Could not access the selected workspace. Please try again.');
  }
  console.log(2);
  const userInfo = await requestUserInfo(axiosInstance, workspace.id);
  if (!userInfo) {
    throw new Error('Could not get user info. Please try again.');
  }
  console.log(3);
  const tokens = store.get(temporaryTokensAtom);
  if (!tokens) {
    throw new Error('Could not get tokens. Please try again.');
  }
  console.log(4);
  const newAccessToken = tokens.accessToken;
  const newRefreshToken = tokens.refreshToken;
  store.set(temporaryTokensAtom, null);

  console.log(newAccessToken);
  console.log(workspace.id);

  const defaultLuminance = getLuminance('#000');
  return {
    workspace,
    userInfo,
    jiraAccount: {
      accountId: userInfo.accountId,
      name: userInfo.displayName,
      avatarUrl: userInfo.avatarUrls?.['48x48'],
      workspaceName: workspace.name,
      workspaceAvatarUrl: workspace.avatarUrl,
      workspaceColors: {
        light: setLightness(Math.min(defaultLuminance, 0.65), '#000'),
        dark: setLightness(Math.max(defaultLuminance, 0.35), '#000'),
      },
      isPrimary: false,
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
        Alert.alert('Your session has expired!', 'Please log in again.');
        store.set(temporaryTokensAtom, null);
      } else {
        // Retrow unexpected errors
        throw err;
      }
    }

    return axiosInstance.request(error.config);
  }

  return Promise.reject(error);
}
