import { Worklog, WorklogState } from '../types/global.types';
import { formatDateToYYYYMMDD } from './date.service';
import { createRemoteWorklog, updateRemoteWorklog } from './jira.service';

function getLocalId(): string {
  return `local_${Date.now()}`;
}

export function createNewLocalWorklog({
  issue,
}: {
  issue: {
    id: string;
    key: string;
    summary: string;
  };
}): Worklog {
  return {
    id: getLocalId(),
    issue,
    started: formatDateToYYYYMMDD(new Date()),
    timeSpentSeconds: 0,
    comment: '',
    state: WorklogState.LOCAL,
  };
}

export function filterWorklogsByDate(worklogs: Worklog[], date: string): Worklog[] {
  return worklogs.filter(worklog => worklog.started === date);
}

export async function syncWorklogs(worklogs: Worklog[]): Promise<void> {
  console.log('syncing worklogs...');
  for (const worklog of worklogs) {
    if (worklog.timeSpentSeconds < 60) {
      console.log('skipping worklog with less than 1 minute', worklog);
      continue;
    }
    if (worklog.state === WorklogState.LOCAL) {
      console.log('creating worklog', worklog);
      await createRemoteWorklog(worklog);
    } else if (worklog.state === WorklogState.EDITED) {
      console.log('updating worklog', worklog);
      await updateRemoteWorklog(worklog);
    }
  }
}
