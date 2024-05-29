import {
  jiraAccountTokensAtom,
  jiraClientsAtom,
  loginsAtom,
  settingsAtom,
  storageCleanup,
  store,
  worklogsLocalAtom,
  worklogsLocalBackupsAtom,
  worklogsRemoteAtom,
} from '../atoms';
import { migrateUp_0_1_14 } from '../migrations/v0.1.14';
import { JiraClientsAtom, LoginsAtom } from '../types/accounts.types';
import { Worklog } from '../types/global.types';
import { initializeJiraAccount } from './jira-auth.service';
import { StorageKey, getFromStorage } from './storage.service';

export async function initialize() {
  // Migrate old account data
  await migrateUp_0_1_14();

  const logins = await getFromStorage(StorageKey.LOGINS);
  const storageJiraAccountTokens = await getFromStorage(StorageKey.JIRA_ACCOUNT_TOKENS);
  const storageWorklogsLocal = await getFromStorage(StorageKey.WORKLOGS_LOCAL);
  const storageWorklogsLocalBackups = await getFromStorage(StorageKey.WORKLOGS_LOCAL_BACKUPS);

  // Clear storage from old data. This function doesn't save anything, it just returns the cleaned data
  const { jiraAccountTokens, worklogsLocal, worklogsLocalBackups } = storageCleanup(
    logins,
    storageJiraAccountTokens,
    storageWorklogsLocal,
    storageWorklogsLocalBackups
  );
  const settings = await getFromStorage(StorageKey.SETTINGS);

  store.set(jiraAccountTokensAtom, jiraAccountTokens ?? {});
  store.set(settingsAtom, settings);
  // There could be new worklogs in the local backups later, so we can't just set it here
  let newWorklogsLocal = worklogsLocal;
  let newWorklogsLocalBackups = worklogsLocalBackups;

  if (logins === null) {
    store.set(loginsAtom, []);
  } else {
    const newLogins: LoginsAtom = [];
    const newJiraClients: JiraClientsAtom = {};
    const newWorklogsRemote: Worklog[] = [];

    for (const account of logins) {
      const tokens = jiraAccountTokens[account.accountId];
      if (!tokens) {
        // We don't have tokens for this account, so we have to store its local worklogs and remove it
        newWorklogsLocal = newWorklogsLocal.filter(worklog => {
          if (worklog.uuid === account.uuid) {
            newWorklogsLocalBackups.push(worklog);
            return false;
          }
          return true;
        });
        return;
      }
      const { login, jiraClient, worklogs } = await initializeJiraAccount(tokens.accessToken, tokens.refreshToken);
      newLogins.push({ ...login, isPrimary: account.isPrimary });
      newJiraClients[account.uuid] = jiraClient;
      newWorklogsRemote.push(...worklogs);
    }
    if (newLogins.length > 0 && !newLogins.some(account => account.isPrimary)) {
      // No primary account, so we make the first account primary
      newLogins[0].isPrimary = true;
    }
    // Persist loaded data in store
    store.set(loginsAtom, newLogins);
    store.set(jiraClientsAtom, newJiraClients);
    store.set(worklogsRemoteAtom, newWorklogsRemote);
  }

  store.set(worklogsLocalAtom, newWorklogsLocal);
  store.set(worklogsLocalBackupsAtom, newWorklogsLocalBackups);
}
