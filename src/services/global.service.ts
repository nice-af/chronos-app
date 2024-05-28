import {
  jiraAccountsAtom,
  jiraAuthsAtom,
  jiraClientsAtom,
  settingsAtom,
  storageCleanup,
  store,
  worklogsLocalAtom,
  worklogsLocalBackupsAtom,
  worklogsRemoteAtom,
} from '../atoms';
import { migrateUp_0_1_14 } from '../migrations/v0.1.14';
import { Worklog } from '../types/global.types';
import { initializeJiraAccount } from './jira-auth.service';
import { JiraAccountsAtom, JiraClientsAtom, StorageKey, getFromStorage } from './storage.service';

export async function initialize() {
  // Migrate old account data
  await migrateUp_0_1_14();

  const jiraAccounts = await getFromStorage(StorageKey.ACCOUNTS);
  const storageJiraAuths = await getFromStorage(StorageKey.AUTHS);
  const storageWorklogsLocal = await getFromStorage(StorageKey.WORKLOGS_LOCAL);
  const storageWorklogsLocalBackups = await getFromStorage(StorageKey.WORKLOGS_LOCAL_BACKUPS);

  // Clear storage from old data. This function doesn't save anything, it just returns the cleaned data
  const { jiraAuths, worklogsLocal, worklogsLocalBackups } = storageCleanup(
    jiraAccounts,
    storageJiraAuths,
    storageWorklogsLocal,
    storageWorklogsLocalBackups
  );
  const settings = await getFromStorage(StorageKey.SETTINGS);

  store.set(jiraAuthsAtom, jiraAuths ?? {});
  store.set(settingsAtom, settings);
  // There could be new worklogs in the local backups later, so we can't just set it here
  let newWorklogsLocal = worklogsLocal;
  let newWorklogsLocalBackups = worklogsLocalBackups;

  if (jiraAccounts === null) {
    store.set(jiraAccountsAtom, []);
  } else {
    const newAccountsData: JiraAccountsAtom = [];
    const newJiraClients: JiraClientsAtom = {};
    const newWorklogsRemote: Worklog[] = [];

    for (const account of jiraAccounts) {
      const auth = jiraAuths[account.accountId];
      if (!auth) {
        // We don't have auth for this account, so we have to store its local worklogs and remove it
        newWorklogsLocal = newWorklogsLocal.filter(worklog => {
          if (worklog.accountId === account.accountId) {
            newWorklogsLocalBackups.push(worklog);
            return false;
          }
          return true;
        });
        return;
      }
      const { jiraAccount, jiraClient, worklogs } = await initializeJiraAccount(auth.accessToken, auth.refreshToken);
      newAccountsData.push({ ...jiraAccount, isPrimary: account.isPrimary });
      newJiraClients[account.accountId] = jiraClient;
      newWorklogsRemote.push(...worklogs);
    }
    if (newAccountsData.length > 0 && !newAccountsData.some(account => account.isPrimary)) {
      // No primary account, so we make the first account primary
      newAccountsData[0].isPrimary = true;
    }
    // Persist loaded data in store
    store.set(jiraAccountsAtom, newAccountsData);
    store.set(jiraClientsAtom, newJiraClients);
    store.set(worklogsRemoteAtom, newWorklogsRemote);
  }

  store.set(worklogsLocalAtom, newWorklogsLocal);
  store.set(worklogsLocalBackupsAtom, newWorklogsLocalBackups);
}
