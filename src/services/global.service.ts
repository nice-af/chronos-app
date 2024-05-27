import {
  jiraAccountsAtom,
  jiraAuthsAtom,
  jiraClientsAtom,
  settingsAtom,
  store,
  worklogsLocalAtom,
  worklogsRemoteAtom,
} from '../atoms';
import { migrateUp_0_1_14 } from '../migrations/v0.1.14';
import { Worklog } from '../types/global.types';
import { initializeJiraAccount } from './jira-auth.service';
import { JiraAccountsAtom, JiraClientsAtom, StorageKey, getFromStorage } from './storage.service';

export async function initialize() {
  // Migrate old account data
  await migrateUp_0_1_14();

  const auths = await getFromStorage(StorageKey.AUTHS);
  store.set(jiraAuthsAtom, auths ?? {});

  const settings = await getFromStorage(StorageKey.SETTINGS);
  store.set(settingsAtom, settings);

  const worklogsLocal = await getFromStorage(StorageKey.WORKLOGS_LOCAL);
  store.set(worklogsLocalAtom, worklogsLocal);

  const accounts = await getFromStorage(StorageKey.ACCOUNTS);
  if (accounts === null) {
    store.set(jiraAccountsAtom, []);
  } else {
    const newAccountsData: JiraAccountsAtom = [];
    const newJiraClients: JiraClientsAtom = {};
    const newWorklogs: Worklog[] = [];

    for (const account of accounts) {
      const auth = auths[account.accountId];
      if (!auth) {
        // We don't have auth for this account, so we have to remove it
        // TODO: Add a way to re-authenticate
        return;
      }
      const { jiraAccount, jiraClient, worklogs } = await initializeJiraAccount(auth.accessToken, auth.refreshToken);
      newAccountsData.push({ ...jiraAccount, isPrimary: account.isPrimary });
      newJiraClients[account.accountId] = jiraClient;
      newWorklogs.push(...worklogs);
    }
    if (newAccountsData.length > 0 && !newAccountsData.some(account => account.isPrimary)) {
      // No primary account, so we make the first account primary
      newAccountsData[0].isPrimary = true;
    }
    // Persist loaded data in store
    store.set(jiraAccountsAtom, newAccountsData);
    store.set(jiraClientsAtom, newJiraClients);
    store.set(worklogsRemoteAtom, newWorklogs);
  }
}
