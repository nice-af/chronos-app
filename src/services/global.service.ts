import { jiraAuthAtom, settingsAtom, store, userInfoAtom, worklogsLocalAtom, worklogsRemoteAtom } from '../atoms';
import { getRemoteWorklogs, jiraClient } from './jira.service';
import { AuthModel, StorageKey, getFromStorage } from './storage.service';

export async function initialize(newAuth?: AuthModel) {
  const auth = newAuth ?? (await getFromStorage(StorageKey.AUTH));
  store.set(jiraAuthAtom, auth);

  const settings = await getFromStorage(StorageKey.SETTINGS);
  store.set(settingsAtom, settings);

  const worklogsLocal = await getFromStorage(StorageKey.WORKLOGS_LOCAL);
  store.set(worklogsLocalAtom, worklogsLocal);

  if (auth) {
    const userInfoRes = await jiraClient.myself.getCurrentUser();
    const worklogs = await getRemoteWorklogs(userInfoRes.accountId);

    // Persist loaded data in store
    store.set(userInfoAtom, userInfoRes);
    store.set(worklogsRemoteAtom, worklogs);
  }
}
