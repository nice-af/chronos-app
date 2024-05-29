import { store, syncProgressAtom } from '../atoms';
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

export async function syncWorklogs(worklogs: Worklog[], progressPerStep?: number): Promise<void> {
  for (const [i, worklog] of worklogs.entries()) {
    if (worklog.state === WorklogState.LOCAL) {
      await createRemoteWorklog(worklog);
    } else if (worklog.state === WorklogState.EDITED) {
      await updateRemoteWorklog(worklog);
    }
    if (progressPerStep !== undefined) {
      store.set(syncProgressAtom, progressPerStep * (i + 1));
    }
  }
}
