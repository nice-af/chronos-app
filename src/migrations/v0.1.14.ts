import { initializeJiraAccount } from '../services/jira-account.service';
import { StorageKey, getFromStorage, removeFromStorage, setInStorage } from '../services/storage.service';

interface OldAuthModel {
  accessToken: string;
  refreshToken: string;
  cloudId: string;
  workspaceName: string;
}

/**
 * The accounts used to be stored in an auth object in the auth store.
 * In future versions we switched to splitting the data into multiple stores.
 * This migration is used to move the accounts from the auth store to the accounts store.
 */
export async function migrateUp_0_1_14() {
  const oldAuth = (await getFromStorage('auth' as StorageKey)) as any as OldAuthModel;
  if (!oldAuth) {
    return;
  }
  const { login } = await initializeJiraAccount({
    jiraAccountTokens: { accessToken: oldAuth.accessToken, refreshToken: oldAuth.refreshToken, expiresAt: 0 },
  });

  // Add missing account id to the worklogs
  const worklogsLocal = await getFromStorage(StorageKey.WORKLOGS_LOCAL);
  if (worklogsLocal) {
    await setInStorage(
      StorageKey.WORKLOGS_LOCAL,
      worklogsLocal.map(worklog => ({ ...worklog, uuid: login.uuid }))
    );
  }

  // Remove old auth data
  removeFromStorage('auth' as StorageKey);
}
