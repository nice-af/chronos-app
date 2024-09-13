import { store, worklogsLocalAtom } from '../atoms';
import { addProgress } from '../atoms/progress';
import { UUID } from '../types/accounts.types';
import { Worklog, WorklogState } from '../types/global.types';
import { DateString } from './date.service';
import { createRemoteWorklog, updateRemoteWorklog } from './jira-worklogs.service';

function getLocalId(): string {
  return `local_${Date.now()}`;
}

export interface IssueBase {
  id: string;
  key: string;
  summary: string;
}

export function createNewLocalWorklog({
  issue,
  started,
  uuid,
}: {
  issue: IssueBase;
  started: DateString;
  uuid: UUID;
}): Worklog {
  return {
    id: getLocalId(),
    issue,
    started,
    timeSpentSeconds: 0,
    comment: '',
    state: WorklogState.LOCAL,
    uuid,
  };
}

export function filterWorklogsByDate(worklogs: Worklog[], date: string): Worklog[] {
  return worklogs.filter(worklog => worklog.started === date);
}

export async function syncWorklogs(worklogs: Worklog[]): Promise<{ error?: string }> {
  const syncedWorklogs: Worklog[] = [];
  try {
    for (const worklog of worklogs) {
      if (worklog.state === WorklogState.LOCAL) {
        await createRemoteWorklog(worklog);
        syncedWorklogs.push(worklog);
      } else if (worklog.state === WorklogState.EDITED) {
        await updateRemoteWorklog(worklog);
        syncedWorklogs.push(worklog);
      }
      addProgress();
    }
  } catch (e) {
    // If an error occurs, we want to remove the worklogs that were successfully synced
    store.set(worklogsLocalAtom, worklogsLocal =>
      worklogsLocal.filter(w => !syncedWorklogs.find(sw => sw.id === w.id))
    );
    if (e instanceof Error) {
      return { error: `Failed to sync worklogs: ${e.message}` };
    }
  }
  return {};
}
