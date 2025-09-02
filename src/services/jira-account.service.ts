import { Alert } from 'react-native';
import { addJiraAccountTokensToStore, addLoginToStore, store, worklogsRemoteAtom } from '../atoms';
import { colorKeys } from '../styles/theme/theme-types';
import { AccountId, CloudId, JiraAccountTokens, LoginModel, UUID } from '../types/accounts.types';
import { getUserInfo, getWorkspaceInfo, refreshAccessToken } from './jira-api-fetch';
import { createJiraClient } from './jira-client.service';
import { getRemoteWorklogs } from './jira-worklogs.service';
import { User } from 'jira.js/out/version3/models';
import { JiraResource } from '../types/jira.types';
import { Worklog } from '../types/global.types';

interface InitializeJiraAccountData {
  jiraAccountTokens: JiraAccountTokens;
  /**
   * Pass a current login if you want to update an existing login
   */
  currentLogin?: LoginModel;
  /**
   * Add hooks to be called when certain progress points are reached. Used to update a progress bar.
   */
  options?: {
    onWorkspaceInfoFetched?: () => void;
    onUserInfoFetched?: () => void;
    onFinished?: () => void;
    storeRemoteWorklogs?: boolean;
  };
}

/**
 * Makes all the necessary calls to initialize the Jira account
 */
export async function initializeJiraAccount({ jiraAccountTokens, currentLogin, options }: InitializeJiraAccountData) {
  if (jiraAccountTokens.expiresAt < Date.now()) {
    try {
      const newJiraAccountTokens = await refreshAccessToken(jiraAccountTokens.refreshToken);
      jiraAccountTokens = newJiraAccountTokens;
    } catch (error) {
      Alert.alert('Failed fetching access token', (error as Error).message);
    }
  }

  let workspaceInfo: JiraResource;
  try {
    workspaceInfo = await getWorkspaceInfo(jiraAccountTokens.accessToken, currentLogin?.cloudId);
    if (options?.onWorkspaceInfoFetched) {
      options.onWorkspaceInfoFetched();
    }
  } catch (error) {
    Alert.alert('Failed fetching workspace info', (error as Error).message);
    throw error;
  }

  let userInfo: User;
  try {
    userInfo = await getUserInfo(jiraAccountTokens.accessToken, workspaceInfo.id as CloudId);
    if (options?.onUserInfoFetched) {
      options.onUserInfoFetched();
    }
  } catch (error) {
    Alert.alert('Failed fetching user info', (error as Error).message);
    throw error;
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
    workspaceAvatarUrl: workspaceInfo.avatarUrl ?? '',
    selectedLogo: currentLogin?.selectedLogo ?? 'navbarLogo',
    workspaceColor: currentLogin?.workspaceColor ?? colorKeys[Math.floor(Math.random() * colorKeys.length)],
    customWorkspaceColor: currentLogin?.customWorkspaceColor,
    isPrimary: currentLogin?.isPrimary ?? false,
  };

  addJiraAccountTokensToStore(login.accountId, jiraAccountTokens);
  addLoginToStore(login);
  createJiraClient(login.uuid, login.accountId, login.cloudId);

  let newWorklogsRemote: Worklog[];
  try {
    newWorklogsRemote = await getRemoteWorklogs(login.uuid, login.accountId);
  } catch (error) {
    Alert.alert('Failed fetching remote worklogs', (error as Error).message);
    throw error;
  }
  if (!(options?.storeRemoteWorklogs === false)) {
    const currentWorklogsRemote = store.get(worklogsRemoteAtom);
    store.set(
      worklogsRemoteAtom,
      currentWorklogsRemote.filter(worklog => worklog.uuid !== login.uuid).concat(newWorklogsRemote)
    );
  }

  if (options?.onFinished) {
    options.onFinished();
  }

  return { login, newWorklogsRemote };
}
