import { WorklogCompact, WorklogDaysObject } from '../types/global.types';

export function convertWorklogsToDaysObject(worklogs: WorklogCompact[]): WorklogDaysObject {
  const daysObject: WorklogDaysObject = {};
  worklogs.forEach(worklog => {
    const date = worklog.started.split('T')[0];
    if (!daysObject[date]) {
      daysObject[date] = { totalTimeSpent: 0, worklogs: [] };
    }
    daysObject[date].totalTimeSpent += worklog.timeSpent;
    daysObject[date].worklogs.push(worklog);
  });
  return daysObject;
}
