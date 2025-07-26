/**
 * This file contains functions to interact directly with the Jira API through fetch requests.
 * The reqeusts in here therefore don't use the Jira.js client.
 */
import { OAUTH_BASE_URL } from '@env';
import { Version3Models } from 'jira.js';
import { Alert } from 'react-native';
import { CloudId, JiraAccountTokens } from '../types/accounts.types';
import { GetOauthTokenErrorResponse, GetOauthTokenResponse, JiraResource } from '../types/jira.types';
import { getModalAccountSelection } from './modal.service';

/**
 * Exchanges the OAuth code for an access token and refresh token
 */
export async function getOAuthToken(code: string): Promise<JiraAccountTokens> {
  const response = await fetch(`${OAUTH_BASE_URL}/api/jira-oauth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      code,
    }),
  });

  const jsonRes = (await response.json()) as GetOauthTokenResponse | GetOauthTokenErrorResponse;

  if ('error' in jsonRes) {
    throw new Error(jsonRes.error_description || 'Failed to fetch OAuth token');
  }

  return {
    accessToken: jsonRes.access_token,
    refreshToken: jsonRes.refresh_token,
    expiresAt: Date.now() + jsonRes.expires_in * 1000,
  };
}

/**
 * Gets a new access and refresh token using a refresh token
 */
export async function refreshAccessToken(refreshToken: string): Promise<JiraAccountTokens> {
  const response = await fetch(`${OAUTH_BASE_URL}/api/jira-oauth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  const jsonRes = (await response.json()) as GetOauthTokenResponse | GetOauthTokenErrorResponse;

  if ('error' in jsonRes) {
    throw new Error(jsonRes.error_description || 'Failed to refresh access token');
  }

  return {
    accessToken: jsonRes.access_token,
    refreshToken: jsonRes.refresh_token,
    expiresAt: Date.now() + jsonRes.expires_in * 1000,
  };
}

/**
 * Request remote info about the workspace, mainly the correct cloud id to connect to
 */
export async function getWorkspaceInfo(accessToken: string, cloudId?: CloudId): Promise<JiraResource> {
  const resources = await fetch('https://api.atlassian.com/oauth/token/accessible-resources', {
    headers: { Authorization: `Bearer ${accessToken}` },
  }).then(response => response.json() as Promise<JiraResource[]>);

  // If we got a cloudId then we are looking for a specific workspace
  if (cloudId) {
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
