import { addJiraAccountTokensToStore, addLoginToStore } from '../atoms';
import { colorKeys } from '../styles/theme/theme-types';
import { AccountId, CloudId, JiraAccountTokens, LoginModel, UUID } from '../types/accounts.types';
import { getUserInfo, getWorkspaceInfo, refreshAccessToken } from './jira-api-fetch';
import { createJiraClient } from './jira-client.service';
import { updateRemoteWorklogsOfLogin } from './jira-worklogs.service';

interface InitializeJiraAccountData {
  jiraAccountTokens: JiraAccountTokens;
  /**
   * Pass a current login if you want to update an existing login
   */
  currentLogin?: LoginModel;
  /**
   * Add hooks to be called when certain progress points are reached. Used to update a progress bar.
   */
  progressHooks?: {
    onWorkspaceInfoFetched?: () => void;
    onUserInfoFetched?: () => void;
    onFinished?: () => void;
  };
}

/**
 * Makes all the necessary calls to initialize the Jira account
 */
export async function initializeJiraAccount({
  jiraAccountTokens,
  currentLogin,
  progressHooks,
}: InitializeJiraAccountData) {
  if (jiraAccountTokens.expiresAt < Date.now()) {
    const newJiraAccountTokens = await refreshAccessToken(jiraAccountTokens.refreshToken);
    jiraAccountTokens = newJiraAccountTokens;
  }
  const workspaceInfo = await getWorkspaceInfo(jiraAccountTokens.accessToken, currentLogin?.cloudId);
  if (progressHooks?.onWorkspaceInfoFetched) {
    progressHooks.onWorkspaceInfoFetched();
  }

  const userInfo = await getUserInfo(jiraAccountTokens.accessToken, workspaceInfo.id as CloudId);
  if (progressHooks?.onUserInfoFetched) {
    progressHooks.onUserInfoFetched();
  }

  const login: LoginModel = {
    uuid: `${userInfo.accountId}__${workspaceInfo.id}` as UUID,
    accountId: userInfo.accountId as AccountId,
    cloudId: workspaceInfo.id as CloudId,
    name: userInfo.displayName ?? '',
    avatarUrl: userInfo.avatarUrls?.['48x48'] ?? '',
    workspaceUrl: workspaceInfo.url,
    workspaceName: workspaceInfo.name,
    workspaceDisplayName: currentLogin?.workspaceDisplayName ?? workspaceInfo.name,
    workspaceColor: currentLogin?.workspaceColor ?? colorKeys[Math.floor(Math.random() * colorKeys.length)],
    customWorkspaceColor: currentLogin?.customWorkspaceColor,
    isPrimary: currentLogin?.isPrimary ?? false,
  };

  addJiraAccountTokensToStore(login.accountId, jiraAccountTokens);
  addLoginToStore(login);
  createJiraClient(login.uuid, login.accountId, login.cloudId);
  updateRemoteWorklogsOfLogin(login.uuid, login.accountId);

  if (progressHooks?.onFinished) {
    progressHooks.onFinished();
  }

  return login;
}
