import { JIRA_CLIENT_ID, JIRA_REDIRECT_URI, JIRA_SECRET } from '@env';
import qs from 'qs';
import { useContext, useEffect, useRef, useState } from 'react';
import { Alert, Linking } from 'react-native';
import uuid from 'react-native-uuid';
import { GlobalContext } from '../contexts/global.context';
import { GetAccessibleResourcesResponse, GetOauthTokenResponse } from '../types/auth.types';
import { getUrlParams } from '../utils/url';
import { initiateJiraClient } from './jira.service';
import { StorageKey, setInStorage } from './storage.service';

/**
 * Exchanges the OAuth code for an access token and refresh token
 */
async function getOAuthToken(code: string): Promise<GetOauthTokenResponse> {
  return await fetch('https://auth.atlassian.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      client_id: JIRA_CLIENT_ID,
      client_secret: JIRA_SECRET,
      code: code,
      redirect_uri: JIRA_REDIRECT_URI,
    }),
  }).then(response => response.json() as Promise<GetOauthTokenResponse>);
}

/**
 * Gets a new access and refresh token, valid for one hour.
 */
export async function refreshAccessToken(refreshToken: string): Promise<GetOauthTokenResponse> {
  return await fetch('https://auth.atlassian.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'refresh_token',
      client_id: JIRA_CLIENT_ID,
      client_secret: JIRA_SECRET,
      refresh_token: refreshToken,
    }),
  }).then(response => response.json() as Promise<GetOauthTokenResponse>);
}

/**
 * Get correct cloud id to connect to
 */
async function getCloudId(accessToken: string): Promise<string | null> {
  return await fetch('https://api.atlassian.com/oauth/token/accessible-resources', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then(response => response.json() as Promise<GetAccessibleResourcesResponse>)
    // TODO @florianmrz how do we handle multiple resources?
    .then(resources => resources[0]?.id);
}

export const useAuthRequest = () => {
  const { setUserInfo } = useContext(GlobalContext);
  const state = useRef<string>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    Linking.addEventListener('url', handleDeepLink);
    return () => {
      Linking.removeAllListeners('url');
    };
  }, []);

  async function handleDeepLink(event: { url: string }) {
    const { code: urlCode, state: urlState } = getUrlParams(event.url);
    try {
      if (state.current !== urlState || !urlCode) {
        throw new Error('An error occured while authenticating. Maybe your session timed out? Please try again.');
      }
      const oAuthResponse = await getOAuthToken(urlCode);
      const { access_token: accessToken, refresh_token: refreshToken } = oAuthResponse;
      const cloudId = await getCloudId(oAuthResponse.access_token);

      if (!cloudId) {
        // TODO better wording - when does this actually happen? (e.g. when the user has no Jira account?)
        throw new Error('Could not find a valid resource to connect to. Please try again.');
      }

      await setInStorage(StorageKey.AUTH, { accessToken, refreshToken, cloudId });
      const client = initiateJiraClient({ accessToken, cloudId, refreshToken });
      const userInfo = await client.myself.getCurrentUser();
      setUserInfo(userInfo);
    } catch (error) {
      Alert.alert((error as Error).message);
      return;
    } finally {
      setIsLoading(false);
    }
  }

  async function initOAuth() {
    // TODO @AdrianFahrbach can we replace this with a basic `Math.random()` and some other random input, so we can get rid of this dependency?
    state.current = uuid.v4().toString();
    let oAuthUrl = 'https://auth.atlassian.com/authorize?';
    oAuthUrl += qs.stringify({
      audience: 'api.atlassian.com',
      client_id: JIRA_CLIENT_ID,
      scope: [
        'read:account',
        'read:application-role:jira',
        'read:audit-log:jira',
        'read:avatar:jira',
        'read:field-configuration:jira',
        'read:field:jira',
        'read:field.default-value:jira',
        'read:field.option:jira',
        'read:group:jira',
        'read:issue-details:jira',
        'read:issue-meta:jira',
        'read:issue-type:jira',
        'read:issue-worklog:jira',
        'write:issue-worklog:jira',
        'delete:issue-worklog:jira',
        'read:issue-worklog.property:jira',
        'write:issue-worklog.property:jira',
        'delete:issue-worklog.property:jira',
        'read:issue:jira',
        'read:me',
        'read:project-role:jira',
        'read:user:jira',
        'offline_access', // This scope is required to get a refresh token
      ].join(' '),
      redirect_uri: JIRA_REDIRECT_URI,
      state: state.current,
      response_type: 'code',
      prompt: 'consent',
    });

    if (await Linking.canOpenURL(oAuthUrl)) {
      await Linking.openURL(oAuthUrl);
      setIsLoading(true);
    } else {
      Alert.alert(`This device can't open this URL: ${oAuthUrl}`);
    }
  }

  return {
    isLoading,
    initOAuth,
  };
};
