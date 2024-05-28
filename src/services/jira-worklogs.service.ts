import { Issue, Project as JiraProject, Worklog as JiraWorklog } from 'jira.js/out/version3/models';
import ms from 'ms';
import { store } from '../atoms';
import { upsertProjectAtom } from '../atoms/project';
import { Worklog, WorklogState } from '../types/global.types';
import { convertAdfToMd, convertMdToAdf } from './atlassian-document-format.service';
import { formatDateToJiraFormat, formatDateToYYYYMMDD, parseDateFromYYYYMMDD } from './date.service';
import { getJiraClient } from './jira-auth.service';
import { createNewLocalProject, loadAvatarForProject } from './project.service';
import { parseDurationStringToSeconds } from './time.service';

/**
 * Converts Jira worklogs to our custom format
 */
function convertWorklogs(worklogs: JiraWorklog[], accountId: string, issue: Issue): Worklog[] {
  return worklogs
    ?.filter(worklog => worklog.author?.accountId === accountId && worklog.started && worklog.timeSpent)
    .map(worklog => ({
      id: worklog.id ?? '',
      issue: {
        id: issue.id,
        key: issue.key,
        summary: issue.fields.summary,
      },
      started: formatDateToYYYYMMDD(new Date(worklog.started ?? 0)),
      timeSpentSeconds: (worklog.timeSpent ?? '').split(' ').reduce((acc: number, curr: string) => {
        console.log(curr, parseDurationStringToSeconds(curr), parseDurationStringToSeconds(curr) / 60 / 60);
        return acc + parseDurationStringToSeconds(curr);
      }, 0),
      comment: worklog.comment ? convertAdfToMd(worklog.comment) : '',
      state: WorklogState.SYNCED,
      accountId: accountId,
    }));
}

/**
 * Loads all worklogs of the last month of the current user from JIRA
 */
export async function getRemoteWorklogs(accountId: string): Promise<Worklog[]> {
  const startedAfterTimestamp = new Date().getTime() - ms('4w');
  const jiraClient = getJiraClient(accountId);
  const worklogsCompact: Worklog[] = [];
  const jqlQuery = `worklogAuthor = ${accountId} AND worklogDate > -4w`;
  const maxIssuesResults = 40;
  let totalIssues = 1;
  let issuesFailsafe = 0;

  // Loop through all issues with recent worklogs
  for (let currentIssue = 0; currentIssue < totalIssues; issuesFailsafe++) {
    const issuesCall = await jiraClient.issueSearch.searchForIssuesUsingJqlPost({
      jql: jqlQuery,
      fields: ['summary', 'worklog', 'project'],
      maxResults: maxIssuesResults,
      startAt: currentIssue,
    });

    for (const issue of issuesCall.issues ?? []) {
      // Get worklogs for each issue
      if (issue.fields.worklog?.total && issue.fields.worklog?.total < (issue.fields.worklog?.maxResults ?? 0)) {
        // This issue already has all worklogs
        worklogsCompact.push(...convertWorklogs(issue.fields.worklog.worklogs ?? [], accountId, issue));
      } else {
        // This issue has more worklogs than we have fetched
        const maxWorklogResults = 5000;
        let totalWorklogs = 1;
        let worklogsFailsafe = 0;
        for (let currentWorklog = 0; currentWorklog < totalWorklogs; worklogsFailsafe++) {
          const worklogsCall = await jiraClient.issueWorklogs.getIssueWorklog({
            issueIdOrKey: issue.id,
            maxResults: maxWorklogResults,
            startAt: currentWorklog,
            startedAfter: startedAfterTimestamp,
          });
          worklogsCompact.push(...convertWorklogs(worklogsCall.worklogs ?? [], accountId, issue));
          currentWorklog += maxWorklogResults;
          totalWorklogs = worklogsCall.total ?? 0;
          if (worklogsFailsafe > 20) {
            // We have fetched more then 10 times, something is wrong
            throw new Error('Too many worklogs calls');
          }
        }
      }

      if (issue.fields.project) {
        const project = createNewLocalProject(issue.fields.project as JiraProject, accountId);
        store.set(upsertProjectAtom, project);
        loadAvatarForProject(project);
      }
    }

    currentIssue += maxIssuesResults;
    totalIssues = issuesCall.total ?? 0;
    if (issuesFailsafe > 20) {
      // We have fetched more then 20 times, something is wrong
      throw new Error('Too many issues calls');
    }
  }

  return worklogsCompact;
}

export function createRemoteWorklog(worklog: Worklog) {
  const jiraClient = getJiraClient(worklog.accountId);
  return jiraClient.issueWorklogs.addWorklog({
    issueIdOrKey: worklog.issue.id,
    started: formatDateToJiraFormat(parseDateFromYYYYMMDD(worklog.started)),
    timeSpentSeconds: worklog.timeSpentSeconds,
    comment: convertMdToAdf(worklog.comment),
  });
}

export function updateRemoteWorklog(worklog: Worklog) {
  const jiraClient = getJiraClient(worklog.accountId);
  return jiraClient.issueWorklogs.updateWorklog({
    issueIdOrKey: worklog.issue.id,
    id: worklog.id,
    started: formatDateToJiraFormat(parseDateFromYYYYMMDD(worklog.started)),
    timeSpentSeconds: worklog.timeSpentSeconds,
    comment: convertMdToAdf(worklog.comment),
  });
}

export function deleteRemoteWorklog(worklog: Worklog) {
  const jiraClient = getJiraClient(worklog.accountId);
  return jiraClient.issueWorklogs.deleteWorklog({
    issueIdOrKey: worklog.issue.id,
    id: worklog.id,
  });
}
