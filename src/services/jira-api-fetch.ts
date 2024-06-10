/**
 * This file contains functions to interact directly with the Jira API through fetch requests.
 * The reqeusts in here therefore don't use the Jira.js client.
 */
import { JIRA_CLIENT_ID, JIRA_REDIRECT_URI, JIRA_SECRET } from '@env';
import { Version3Models } from 'jira.js';
import { Alert } from 'react-native';
import { CloudId, JiraAccountTokens } from '../types/accounts.types';
import { GetOauthTokenErrorResponse, GetOauthTokenResponse, JiraResource } from '../types/jira.types';
import { getModalAccountSelection } from './modal.service';

const handleOAuthError = (res: GetOauthTokenResponse | GetOauthTokenErrorResponse): GetOauthTokenResponse => {
  if ('error' in res) {
    throw new Error(res.error_description);
  }
  return res;
};

/**
 * Exchanges the OAuth code for an access token and refresh token
 */
export async function getOAuthToken(code: string): Promise<GetOauthTokenResponse> {
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
  })
    .then(response => response.json() as Promise<GetOauthTokenResponse | GetOauthTokenErrorResponse>)
    .then(handleOAuthError);
}

/**
 * Gets a new access and refresh token using a refresh token
 */
export async function refreshAccessToken(refreshToken: string): Promise<JiraAccountTokens> {
  return await fetch('https://auth.atlassian.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'refresh_token',
      client_id: JIRA_CLIENT_ID,
      client_secret: JIRA_SECRET,
      refresh_token: refreshToken,
    }),
  })
    .then(response => response.json() as Promise<GetOauthTokenResponse | GetOauthTokenErrorResponse>)
    .then(handleOAuthError)
    .then(data => ({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: Date.now() + data.expires_in * 1000,
    }));
}

/**
 * Request remote info about the workspace, mainly the correct cloud id to connect to
 */
export async function getWorkspaceInfo(accessToken: string, cloudId?: CloudId): Promise<JiraResource> {
  const resources = await fetch('https://api.atlassian.com/oauth/token/accessible-resources', {
    headers: { Authorization: `Bearer ${accessToken}` },
  }).then(response => {
    console.log(response);
    return response.json() as Promise<JiraResource[]>;
  });

  // If we got a cloudId then we are looking for a specific workspace
  if (cloudId) {
    console.log(resources);
    const foundResource = resources.find(resource => resource.id === cloudId) ?? null;
    if (!foundResource) {
      Alert.alert(
        'An unexpected error has occurred',
        'We could not find the workspace you were connected to. Please try logging in again.'
      );
      throw new Error('Could not find the connected workspace. Please try logging in again.');
    }
    return foundResource;
  }

  // If we only have permission to access one workspace, we can just use that
  if (resources.length === 1) {
    return resources[0];
  }

  // Otherwise we need to ask the user to select a workspace
  const targetCloudId = await getModalAccountSelection({ jiraResources: resources });
  const foundResource = resources.find(resource => resource.id === targetCloudId) ?? null;
  if (!foundResource) {
    Alert.alert('An unexpected error has occurred', 'We could not find the workspace you selected. Please try again.');
    throw new Error('Could not find the workspace you selected. Please try again.');
  }

  return foundResource;
}

/**
 * Request remote info about the user.
 * Jira.js does provide a method for this, but we need the information before we can create a client.
 */
export async function getUserInfo(accessToken: string, cloudId: CloudId): Promise<Version3Models.User> {
  return await fetch(`https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/myself`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  }).then(response => response.json() as Promise<Version3Models.User>);
}
