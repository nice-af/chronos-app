import {
  jiraAccountsAtom,
  jiraAuthsAtom,
  jiraClientsAtom,
  settingsAtom,
  storageCleanup,
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

  // Clear storage from old data
  // We already read and write to stirage in the cleanup function,
  // so we get the data from there instead of accessing the store again
  const { jiraAuths, jiraAccounts, worklogsLocal, worklogsLocalBackups } = storageCleanup();
  const settings = await getFromStorage(StorageKey.SETTINGS);

  store.set(jiraAuthsAtom, jiraAuths ?? {});
  store.set(settingsAtom, settings);
  store.set(worklogsLocalAtom, worklogsLocal);

  if (jiraAccounts === null) {
    store.set(jiraAccountsAtom, []);
  } else {
    const newAccountsData: JiraAccountsAtom = [];
    const newJiraClients: JiraClientsAtom = {};
    const newWorklogs: Worklog[] = [];

    for (const account of jiraAccounts) {
      const auth = jiraAuths[account.accountId];
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
