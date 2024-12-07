import ms from 'ms';
import { AccountId, JiraAccountTokensAtom, LoginsAtom, UUID } from '../types/accounts.types';
import { Worklog } from '../types/global.types';
import { jiraAccountTokensAtom, jiraClientsAtom, loginsAtom } from './auth';
import { projectsProtectedAtom } from './project';
import { store } from './store';
import { worklogsLocalAtom, worklogsLocalBackupsAtom, worklogsRemoteAtom } from './worklog';

/**
 * Logs the user out but keeps local worklogs
 */
export function logout(uuid: UUID, accountId: AccountId) {
  const logins = store.get(loginsAtom);

  // Delete account tokens if no login is using them
  const jiraAccountTokens = store.get(jiraAccountTokensAtom);
  if (!logins.some(login => login.accountId === accountId)) {
    delete jiraAccountTokens[accountId];
    store.set(jiraAccountTokensAtom, jiraAccountTokens);
  }

  // Delete Jira client
  const jiraClients = store.get(jiraClientsAtom);
  delete jiraClients[uuid];
  store.set(jiraClientsAtom, jiraClients);

  // Clean up worklogs
  const worklogsRemote = store.get(worklogsRemoteAtom);
  store.set(
    worklogsRemoteAtom,
    worklogsRemote.filter(worklog => worklog.uuid !== uuid)
  );
  const worklogsLocal = store.get(worklogsLocalAtom);
  const thisAccountsWorklogs = worklogsLocal.filter(worklog => worklog.uuid === uuid);
  store.set(
    worklogsLocalAtom,
    worklogsLocal.filter(worklog => worklog.uuid !== uuid)
  );
  store.set(worklogsLocalBackupsAtom, [...store.get(worklogsLocalBackupsAtom), ...thisAccountsWorklogs]);

  const jiraAccounts = store.get(loginsAtom);
  store.set(
    loginsAtom,
    jiraAccounts.filter(account => account.accountId !== accountId)
  );
}

/**
 * We don't want our storage to grow indefinitely, so we need to clean it up from time to time.
 * This only cleans the given data and does not save or store anything, but rather returns the cleaned data.
 * This function is called when the app starts and does the following:
 * - Removes auths that do not have a corresponding account
 * - Removes all local worklogs that are older than 60 days
 * - Removes all backup worklogs that are older than 60 days
 * - Limits the maximum number of projects to 250 by removing the first ones in the array
 */
export function storageCleanup(
  logins: LoginsAtom,
  jiraAccountTokens: JiraAccountTokensAtom,
  worklogsLocal: Worklog[],
  worklogsLocalBackups: Worklog[]
) {
  const now = Date.now();

  // Clean account tokens
  if (jiraAccountTokens) {
    const accountIds = logins.map(account => account.accountId);
    const hasUnlinkedAuths = Object.keys(jiraAccountTokens).some(
      accountId => !accountIds.includes(accountId as AccountId)
    );
    if (hasUnlinkedAuths) {
      const newAuths = Object.fromEntries(
        Object.entries(jiraAccountTokens).filter(([accountId]) => accountIds.includes(accountId as AccountId))
      );
      jiraAccountTokens = newAuths;
    }
  }

  // Clean worklogs
  if (worklogsLocal) {
    const worklogsLocalFiltered = worklogsLocal.filter(worklog => {
      const date = new Date(worklog.started).getTime();
      return now - date < ms('60d');
    });
    if (worklogsLocalFiltered.length !== worklogsLocal.length) {
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
      worklogsLocalBackups = worklogsLocalBackupsFiltered;
    }
  }

  // Limit the number of projects
  const projects = store.get(projectsProtectedAtom);
  if (projects.length > 250) {
    store.set(projectsProtectedAtom, projects.slice(-250));
  }

  return {
    jiraAccountTokens,
    worklogsLocal,
    worklogsLocalBackups,
  };
}
