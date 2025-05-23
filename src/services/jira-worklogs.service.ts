import { Issue, Project as JiraProject, Worklog as JiraWorklog } from 'jira.js/src/version3/models';
import ms from 'ms';
import { Alert } from 'react-native';
import { getJiraClientByUUID, loginsAtom, settingsAtom, store, worklogsRemoteAtom } from '../atoms';
import { AccountId, UUID } from '../types/accounts.types';
import { IssueKey, Worklog, WorklogState } from '../types/global.types';
import { convertAdfToMd, convertMdToAdf } from './atlassian-document-format.service';
import { formatDateToJiraFormat, formatDateToYYYYMMDD, parseDateFromYYYYMMDD } from './date.service';
import { upsertProjectByJiraProject } from './project.service';
import { parseDurationStringToSeconds } from './time.service';

/**
 * Converts Jira worklogs to our custom format
 */
function convertWorklogs(worklogs: JiraWorklog[], uuid: UUID, accountId: AccountId, issue: Issue): Worklog[] {
  return worklogs
    ?.filter(worklog => worklog.author?.accountId === accountId && worklog.started && worklog.timeSpent)
    .map(worklog => ({
      id: worklog.id ?? '',
      issue: {
        id: issue.id,
        key: issue.key as IssueKey,
        summary: issue.fields.summary,
      },
      started: formatDateToYYYYMMDD(new Date(worklog.started ?? 0)),
      timeSpentSeconds: (worklog.timeSpent ?? '')
        .split(' ')
        .reduce((acc: number, curr: string) => acc + parseDurationStringToSeconds(curr), 0),
      comment: worklog.comment ? convertAdfToMd(worklog.comment) : '',
      state: WorklogState.SYNCED,
      uuid,
    }));
}

/**
 * Loads all worklogs of the last month of the current user from JIRA
 */
export async function getRemoteWorklogs(uuid: UUID, accountId: AccountId): Promise<Worklog[]> {
  const settings = store.get(settingsAtom);
  const startedAfterTimestamp = new Date().getTime() - ms(settings.worklogsSyncPeriod);
  const jiraClient = getJiraClientByUUID(uuid);
  const worklogsCompact: Worklog[] = [];
  const jqlQuery = `worklogAuthor = ${accountId} AND worklogDate > -${settings.worklogsSyncPeriod}`;
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
        worklogsCompact.push(...convertWorklogs(issue.fields.worklog.worklogs ?? [], uuid, accountId, issue));
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
          worklogsCompact.push(...convertWorklogs(worklogsCall.worklogs ?? [], uuid, accountId, issue));
          currentWorklog += maxWorklogResults;
          totalWorklogs = worklogsCall.total ?? 0;
          if (worklogsFailsafe > 20) {
            // We have fetched worklogs on this issue more then 20 times, something is wrong
            Alert.alert(
              'An unexpected error has occurred',
              'We could not fetch all worklogs for an issue. Please contact our support.'
            );
            throw new Error('Too many worklogs on a single issue to process');
          }
        }
      }

      if (issue.fields.project) {
        await upsertProjectByJiraProject(issue.fields.project as JiraProject, uuid);
      }
    }

    currentIssue += maxIssuesResults;
    totalIssues = issuesCall.total ?? 0;
    if (issuesFailsafe > 30) {
      // We have fetched issues more then 30 times, so we got 30 * 40 issues with worklogs. Something is wrong
      Alert.alert(
        'An unexpected error has occurred',
        'We could not fetch all issues with worklogs. Please contact our support.'
      );
      throw new Error('Too many issues with worklogs in the last month to process');
    }
  }

  return worklogsCompact;
}

export async function refetchAllRemoteWorklogs() {
  const logins = store.get(loginsAtom);
  for (const login of logins) {
    const newWorklogsRemote = await getRemoteWorklogs(login.uuid, login.accountId);
    const currentWorklogsRemote = store.get(worklogsRemoteAtom);
    store.set(
      worklogsRemoteAtom,
      currentWorklogsRemote.filter(worklog => worklog.uuid !== login.uuid).concat(newWorklogsRemote)
    );
  }
}

export function createRemoteWorklog(worklog: Worklog) {
  const jiraClient = getJiraClientByUUID(worklog.uuid);
  return jiraClient.issueWorklogs.addWorklog({
    issueIdOrKey: worklog.issue.id,
    started: formatDateToJiraFormat(parseDateFromYYYYMMDD(worklog.started)),
    timeSpentSeconds: worklog.timeSpentSeconds,
    comment: convertMdToAdf(worklog.comment),
  });
}

export function updateRemoteWorklog(worklog: Worklog) {
  const jiraClient = getJiraClientByUUID(worklog.uuid);
  return jiraClient.issueWorklogs.updateWorklog({
    issueIdOrKey: worklog.issue.id,
    id: worklog.id,
    started: formatDateToJiraFormat(parseDateFromYYYYMMDD(worklog.started)),
    timeSpentSeconds: worklog.timeSpentSeconds,
    comment: convertMdToAdf(worklog.comment),
  });
}

export function deleteRemoteWorklog(worklog: Worklog) {
  const jiraClient = getJiraClientByUUID(worklog.uuid);
  return jiraClient.issueWorklogs.deleteWorklog({
    issueIdOrKey: worklog.issue.id,
    id: worklog.id,
  });
}
