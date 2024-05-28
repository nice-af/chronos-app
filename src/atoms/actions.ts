import ms from 'ms';
import { jiraAccountsAtom, jiraAuthsAtom, jiraClientsAtom } from './auth';
import { projectsProtectedAtom } from './project';
import { store } from './store';
import { worklogsLocalAtom, worklogsLocalBackupsAtom, worklogsRemoteAtom } from './worklog';

/**
 * Logs the user out but keeps local worklogs
 */
export async function logout(accountId: string) {
  const jiraAuths = store.get(jiraAuthsAtom);
  delete jiraAuths[accountId];
  store.set(jiraAuthsAtom, jiraAuths);

  const jiraClients = store.get(jiraClientsAtom);
  delete jiraClients[accountId];
  store.set(jiraClientsAtom, jiraClients);

  const worklogsRemote = store.get(worklogsRemoteAtom);
  store.set(
    worklogsRemoteAtom,
    worklogsRemote.filter(worklog => worklog.accountId !== accountId)
  );

  const worklogsLocal = store.get(worklogsLocalAtom);
  const thisAccountsWorklogs = worklogsLocal.filter(worklog => worklog.accountId === accountId);
  store.set(
    worklogsLocalAtom,
    worklogsLocal.filter(worklog => worklog.accountId !== accountId)
  );
  store.set(worklogsLocalBackupsAtom, [...store.get(worklogsLocalBackupsAtom), ...thisAccountsWorklogs]);

  const jiraAccounts = store.get(jiraAccountsAtom);
  store.set(
    jiraAccountsAtom,
    jiraAccounts.filter(account => account.accountId !== accountId)
  );
}

/**
 * We don't want our storage to grow indefinitely, so we need to clean it up from time to time.
 * This function is called when the app starts and does the following:
 * - Removes auths that do not have a corresponding account
 * - Removes all local worklogs that are older than 60 days
 * - Removes all backup worklogs that are older than 60 days
 * - Limits the maximum number of projects to 250 by removing the first ones in the array
 */
export function storageCleanup() {
  let jiraAuths = store.get(jiraAuthsAtom);
  let jiraAccounts = store.get(jiraAccountsAtom);
  let worklogsLocal = store.get(worklogsLocalAtom);
  let worklogsLocalBackups = store.get(worklogsLocalBackupsAtom);
  const now = Date.now();

  // Clean auths
  if (jiraAuths) {
    const accountIds = jiraAccounts.map(account => account.accountId);
    const hasUnlinkedAuths = Object.keys(jiraAuths).some(authId => !accountIds.includes(authId));
    if (hasUnlinkedAuths) {
      const newAuths = Object.fromEntries(Object.entries(jiraAuths).filter(([authId]) => accountIds.includes(authId)));
      store.set(jiraAuthsAtom, newAuths);
      jiraAuths = newAuths;
    }
  }

  // Clean worklogs
  if (worklogsLocal) {
    const worklogsLocalFiltered = worklogsLocal.filter(worklog => {
      const date = new Date(worklog.started).getTime();
      return now - date < ms('60d');
    });
    if (worklogsLocalFiltered.length !== worklogsLocal.length) {
      store.set(worklogsLocalBackupsAtom, worklogsLocalFiltered);
      worklogsLocal = worklogsLocalFiltered;
    }
  }

  // Clean backup worklogs
  if (worklogsLocalBackups) {
    const worklogsLocalBackupsFiltered = worklogsLocalBackups.filter(worklog => {
      const date = new Date(worklog.started).getTime();
      return now - date < ms('60d');
    });
    if (worklogsLocalBackupsFiltered.length !== worklogsLocalBackups.length) {
      store.set(worklogsLocalBackupsAtom, worklogsLocalBackupsFiltered);
      worklogsLocalBackups = worklogsLocalBackupsFiltered;
    }
  }

  // Limit the number of projects
  const projects = store.get(projectsProtectedAtom);
  if (projects.length > 250) {
    store.set(projectsProtectedAtom, projects.slice(-250));
  }

  return {
    jiraAuths,
    jiraAccounts,
    worklogsLocal,
  };
}
