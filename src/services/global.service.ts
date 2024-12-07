import {
  addWorklogsToBackups,
  jiraAccountTokensAtom,
  loginsAtom,
  settingsAtom,
  storageCleanup,
  store,
  worklogsLocalAtom,
  worklogsLocalBackupsAtom,
} from '../atoms';
import { migrateUp_0_1_14 } from '../migrations/v0.1.14';
import { initializeJiraAccount } from './jira-account.service';
import { StorageKey, getFromStorage } from './storage.service';

export async function initialize() {
  // Migrate old account data
  migrateUp_0_1_14();

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
  const newWorklogsLocalBackups = worklogsLocalBackups;

  if (logins === null) {
    store.set(loginsAtom, []);
  } else {
    for (const login of logins) {
      const tokens = jiraAccountTokens[login.accountId];
      if (!tokens) {
        // We don't have tokens for this account, so we have to store its local worklogs and remove it
        newWorklogsLocal = newWorklogsLocal.filter(worklog => {
          if (worklog.uuid === login.uuid) {
            newWorklogsLocalBackups.push(worklog);
            return false;
          }
          return true;
        });
        continue;
      }
      await initializeJiraAccount({ jiraAccountTokens: tokens, currentLogin: login });
    }
  }

  addWorklogsToBackups(newWorklogsLocalBackups);

  store.set(worklogsLocalAtom, newWorklogsLocal);
  store.set(worklogsLocalBackupsAtom, newWorklogsLocalBackups);
}
