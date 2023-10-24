import uuid from 'react-native-uuid';
import qs from 'qs';
import { Alert, Linking } from 'react-native';
import { useContext, useEffect, useRef, useState } from 'react';
import { JIRA_CLIENT_ID, JIRA_REDIRECT_URI, JIRA_SECRET } from '@env';
import { getUrlParams } from '../utils/url';
import { GetAccessibleResourcesResponse, GetOauthTokenResponse } from '../types/auth.types';
import { GlobalContext } from '../contexts/global.context';

/**
 * Exchanges the OAuth code for an access token
 */
async function getOAuthToken(code: string): Promise<GetOauthTokenResponse> {
  return await fetch('https://auth.atlassian.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      client_id: JIRA_CLIENT_ID,
      client_secret: JIRA_SECRET,
      code: code,
      redirect_uri: JIRA_REDIRECT_URI,
    }),
  }).then(response => response.json());
}

/**
 * Exchanges the OAuth code for an access token
 */
async function getAccessibleResources(accessToken: string): Promise<GetAccessibleResourcesResponse> {
  return await fetch('https://api.atlassian.com/oauth/token/accessible-resources', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  }).then(response => response.json());
}

export const useAuthRequest = () => {
  const { setApiSettings } = useContext(GlobalContext);
  const state = useRef<string>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    Linking.addEventListener('url', handleDeepLink);
  }, []);

  async function handleDeepLink(event: { url: string }) {
    const { code: urlCode, state: urlState } = getUrlParams(event.url);

    if (state.current !== urlState || !urlCode) {
      Alert.alert('An error occured while authenticating. Maybe your session timed out? Please try again.');
      return;
    }
    try {
      const { access_token: newToken } = await getOAuthToken(urlCode);
      const resources = await getAccessibleResources(newToken);
      setApiSettings({ token: newToken, resource: resources[0] });
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      Alert.alert('An error occured while authenticating. Please try again.');
      return;
    }
  }

  async function requestOAuth() {
    state.current = uuid.v4().toString();
    let oAuthUrl = 'https://auth.atlassian.com/authorize?';
    oAuthUrl += qs.stringify({
      audience: 'api.atlassian.com',
      client_id: JIRA_CLIENT_ID,
      scope: 'read:jira-work',
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
    requestOAuth,
  };
};
