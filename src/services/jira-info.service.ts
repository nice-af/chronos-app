import { Version3Models } from 'jira.js';
import { GetAccessibleResourcesResponse } from '../types/auth.types';
import { JiraAccountModel } from './storage.service';

/**
 * Request remote info about the workspace, mainly the correct cloud id to connect to
 */
export async function requestWorkspaceInfo(
  accessToken: string
): Promise<GetAccessibleResourcesResponse[number] | null> {
  return await fetch('https://api.atlassian.com/oauth/token/accessible-resources', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then(response => response.json() as Promise<GetAccessibleResourcesResponse>)
    // TODO @florianmrz how do we handle multiple resources?
    .then(resources => resources[0]);
}

/**
 * Request remote info about the user.
 * Jira.js does provide a method for this, but we need the information before we can create a client.
 */
export async function requestUserInfo(accessToken: string, cloudId: string): Promise<Version3Models.User | null> {
  return await fetch(`https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/myself`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  }).then(response => response.json() as Promise<Version3Models.User>);
}

/**
 * Get the account data for a given access token
 */
export async function requestAccountData(accessToken: string): Promise<JiraAccountModel> {
  const workspace = await requestWorkspaceInfo(accessToken);
  if (!workspace) {
    throw new Error('Could not access the selected workspace. Please try again.');
  }
  const userInfo = await requestUserInfo(accessToken, workspace.id);
  if (!userInfo) {
    throw new Error('Could not get user info. Please try again.');
  }
  return {
    accountId: userInfo.accountId,
    name: userInfo.displayName,
    avatarUrl: userInfo.avatarUrls?.['48x48'],
    workspaceName: workspace.name,
    workspaceAvatarUrl: workspace.avatarUrl,
    isPrimary: false,
  };
}
