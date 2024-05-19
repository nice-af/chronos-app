import { Worklog, WorklogState } from '../types/global.types';
import { DateString } from './date.service';
import { createRemoteWorklog, updateRemoteWorklog } from './jira.service';

function getLocalId(): string {
  return `local_${Date.now()}`;
}

export interface IssueBase {
  id: string;
  key: string;
  summary: string;
}

export function createNewLocalWorklog({ issue, started }: { issue: IssueBase; started: DateString }): Worklog {
  return {
    id: getLocalId(),
    issue,
    started,
    timeSpentSeconds: 0,
    comment: '',
    state: WorklogState.LOCAL,
  };
}

export function filterWorklogsByDate(worklogs: Worklog[], date: string): Worklog[] {
  return worklogs.filter(worklog => worklog.started === date);
}

export async function syncWorklogs(worklogs: Worklog[]): Promise<void> {
  for (const worklog of worklogs) {
    if (worklog.timeSpentSeconds < 60) {
      continue;
    }
    if (worklog.state === WorklogState.LOCAL) {
      await createRemoteWorklog(worklog);
    } else if (worklog.state === WorklogState.EDITED) {
      await updateRemoteWorklog(worklog);
    }
  }
}
