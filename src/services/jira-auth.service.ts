import { JIRA_CLIENT_ID, JIRA_REDIRECT_URI } from '@env';
import qs from 'qs';
import { useEffect, useRef, useState } from 'react';
import { Alert, Linking } from 'react-native';
import { getUrlParams } from '../utils/url';
import { initializeJiraAccount } from './jira-account.service';
import { getOAuthToken } from './jira-api-fetch';

/**
 * A hook to handle the OAuth flow.
 */
export const useAuthRequest = () => {
  const state = useRef<string>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    Linking.addEventListener('url', handleDeepLink);
    return () => {
      Linking.removeAllListeners('url');
    };
  }, []);

  async function handleDeepLink(event: { url: string }) {
    if (!event.url.startsWith(JIRA_REDIRECT_URI)) {
      return;
    }
    setIsLoading(true);
    const { code: urlCode, state: urlState } = getUrlParams(event.url);
    try {
      if (state.current !== urlState || !urlCode) {
        throw new Error('An error occured while authenticating. Maybe your session timed out? Please try again.');
      }
      const {
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: expiresIn,
      } = await getOAuthToken(urlCode);
      await initializeJiraAccount({
        jiraAccountTokens: { accessToken, refreshToken, expiresAt: Date.now() + expiresIn * 1000 },
      });
    } catch (error) {
      Alert.alert('An unexpected error has occurred', (error as Error).message);
      return;
    } finally {
      setIsLoading(false);
    }
  }

  async function initOAuth() {
    state.current = (Math.random() * 100_000_000).toString().replace('.', '');
    let oAuthUrl = 'https://auth.atlassian.com/authorize?';
    oAuthUrl += qs.stringify({
      audience: 'api.atlassian.com',
      client_id: JIRA_CLIENT_ID,
      scope: [
        'delete:issue-worklog:jira',
        'delete:issue-worklog.property:jira',
        'read:account',
        'read:application-role:jira',
        'read:audit-log:jira',
        'read:avatar:jira',
        'read:comment:jira',
        'read:field-configuration:jira',
        'read:field:jira',
        'read:field.default-value:jira',
        'read:field.option:jira',
        'read:group:jira',
        'read:issue-details:jira',
        'read:issue-meta:jira',
        'read:issue-type:jira',
        'read:issue-worklog:jira',
        'read:issue-worklog.property:jira',
        'read:issue:jira',
        'read:me',
        'read:project-role:jira',
        'read:user-configuration:jira',
        'read:user:jira',
        'write:comment:jira',
        'write:issue-worklog:jira',
        'write:issue-worklog.property:jira',
        'write:issue.time-tracking:jira',
        'offline_access', // This scope is required to get a refresh token
      ].join(' '),
      redirect_uri: JIRA_REDIRECT_URI,
      state: state.current,
      response_type: 'code',
      prompt: 'consent',
    });

    if (await Linking.canOpenURL(oAuthUrl)) {
      console.log('oAuthUrl', oAuthUrl);
      await Linking.openURL(oAuthUrl);
    } else {
      Alert.alert(`This device can't open this URL: ${oAuthUrl}`);
    }
  }

  return {
    isLoading,
    initOAuth,
  };
};
