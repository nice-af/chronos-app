import { Issue } from 'jira.js/out/version3/models';
import { Worklog, WorklogState } from '../types/global.types';
import { formatDateToYYYYMMDD } from './date.service';
import { createLocalWorklog, updateLocalWorklog } from './jira.service';

export function createNewWorklogForIssue({
  issue,
  comment,
  started,
}: {
  issue: Issue;
  comment?: string;
  started?: string;
}): Worklog {
  return {
    id: `local_${Math.round(Math.random() * 100_000)}`,
    issue: {
      id: issue.id,
      key: issue.key,
      summary: issue.fields.summary,
    },
    started: started ?? formatDateToYYYYMMDD(new Date()),
    timeSpentSeconds: 0,
    comment: comment ?? '',
    state: WorklogState.Local,
  };
}

export function filterWorklogsByDate(worklogs: Worklog[], date: string): Worklog[] {
  return worklogs.filter(worklog => worklog.started === date);
}

export async function syncWorklogs(worklogs: Worklog[]): Promise<void> {
  console.log('syncing worklogs...');
  for (const worklog of worklogs) {
    if (worklog.state === WorklogState.Local) {
      console.log('creating worklog', worklog);
      await createLocalWorklog(worklog);
    } else if (worklog.state === WorklogState.Edited) {
      console.log('updating worklog', worklog);
      await updateLocalWorklog(worklog);
    }
  }
}
