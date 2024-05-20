import { AxiosInstance } from 'axios';
import { Version3Client } from 'jira.js';
import { Issue, Project as JiraProject, Worklog as JiraWorklog } from 'jira.js/out/version3/models';
import ms from 'ms';
import { Alert } from 'react-native';
import { jiraAuthAtom, store } from '../atoms';
import { upsertProjectAtom } from '../atoms/project';
import { Worklog, WorklogState } from '../types/global.types';
import { convertAdfToMd, convertMdToAdf } from './atlassian-document-format.service';
import { refreshAccessToken } from './auth.service';
import { formatDateToJiraFormat, formatDateToYYYYMMDD, parseDateFromYYYYMMDD } from './date.service';
import { createNewLocalProject, loadAvatarForProject } from './project.service';

// TODO: Use a more lightweight client

export const jiraClient = new Version3Client({ host: 'https://example.com' });

// @ts-expect-error (we are accessing a private property here, but it's the only way to access the underlying Axios instance)
const axiosInstance = jiraClient.instance as AxiosInstance;

// Inject current access token
axiosInstance.interceptors.request.use(async config => {
  const jiraAuth = store.get(jiraAuthAtom);
  config.baseURL = `https://api.atlassian.com/ex/jira/${jiraAuth?.cloudId}`;
  if (jiraAuth?.accessToken) {
    config.headers.Authorization = `Bearer ${jiraAuth!.accessToken}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const status = error.response ? error.response.status : null;

    if (status === 401) {
      const jiraAuth = store.get(jiraAuthAtom);
      if (!jiraAuth?.refreshToken) {
        return Promise.reject(error);
      }

      try {
        const freshTokens = await refreshAccessToken(jiraAuth.refreshToken);
        // Update auth tokens for upcoming requests
        store.set(jiraAuthAtom, {
          ...jiraAuth,
          accessToken: freshTokens.access_token,
          refreshToken: freshTokens.refresh_token,
        });
      } catch (err) {
        if ((err as Error).message === 'refresh_token is invalid') {
          // Refresh token has expired after 90 days, user needs to re-authenticate
          Alert.alert('Your session has expired!', 'Please log in again.');
          store.set(jiraAuthAtom, null);
        } else {
          // Retrow unexpected errors
          throw err;
        }
      }

      return axiosInstance.request(error.config);
    }

    return Promise.reject(error);
  }
);

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
      timeSpentSeconds: (worklog.timeSpent ?? '').split(' ').reduce(
        (acc: number, curr: string) =>
          // TODO: This is a hacky way to convert the Jira time format to ms
          acc + ms(curr.replace('m', 'min').replace('1d', '8h').replace('2d', '16h').replace('3d', '24h')) / 1_000,
        0
      ),
      comment: worklog.comment ? convertAdfToMd(worklog.comment) : '',
      state: WorklogState.SYNCED,
    }));
}

/**
 * Loads all worklogs of the last month of the current user from JIRA
 */
export async function getRemoteWorklogs(accountId: string): Promise<Worklog[]> {
  const startedAfterTimestamp = new Date().getTime() - ms('4w');

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
        const project = createNewLocalProject(issue.fields.project as JiraProject);
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

/**
 * Gets all issues that match a given search query.
 *
 * This searches using three different methods:
 * 1. Exact match:
 *   - If the query is a valid issue key, we search for the exact issue key
 *   - If the query is not a valid issue key, this search is skipped
 * 2. Personalized match
 *   - We search for issues that contain the query in some [text field](https://support.atlassian.com/jira-service-management-cloud/docs/jql-fields/#Text)
 *   - We only search for issues that the user has interacted with (is in the [issue history](https://support.atlassian.com/jira-service-management-cloud/docs/jql-functions/#issueHistory--))
 * 3. General match
 *  - We search for issues that contain the query in some [text field](https://support.atlassian.com/jira-service-management-cloud/docs/jql-fields/#Text)
 *
 * The results are then merged and duplicates are removed while keeping the sorting as listed above.
 */
export async function getIssuesBySearchQuery(query: string) {
  /**
   * // TODO JIRA has a list of reserved characters and words that cannot be used in a JQL query. Is it okay if we escape the query here by removing all quotes?
   * @see https://support.atlassian.com/jira-software-cloud/docs/search-for-issues-using-the-text-field/
   */
  query = query.trim().replaceAll('"', '').replaceAll("'", '');

  const commonOptions = {
    fields: ['summary', 'project'],
    maxResults: 50,
  };
  const orderBy = 'updated DESC';

  // Check if the query is a valid issue key so we can skip the search by exact key if it is not
  const validIssueKey = /^[A-Za-z][A-Za-z0-9_]+-[1-9][0-9]*$/.test(query);
  const reqExact = validIssueKey
    ? jiraClient.issueSearch
        .searchForIssuesUsingJqlPost({
          ...commonOptions,
          jql: `key = "${query.toUpperCase()}" ORDER BY ${orderBy}`,
        })
        .then(res => res.issues)
        .catch(e => console.error(`Failed to execute search type "exact" on query "${query}"`, e))
    : Promise.resolve([]);
  const reqPersonalized = jiraClient.issueSearch
    .searchForIssuesUsingJqlPost({
      ...commonOptions,
      jql: `text ~ "${query}*" AND issue in issueHistory() ORDER BY ${orderBy}`,
    })
    .then(res => res.issues)
    .catch(e => console.error(`Failed to execute search type "personalized" on query "${query}"`, e));
  const reqGeneral = jiraClient.issueSearch
    .searchForIssuesUsingJqlPost({
      ...commonOptions,
      jql: `text ~ "${query}*" ORDER BY ${orderBy}`,
    })
    .then(res => res.issues)
    .catch(e => console.error(`Failed to execute search type "general" on query "${query}"`, e));

  const [resExact, resPersonalized, resGeneral] = await Promise.all([reqExact, reqPersonalized, reqGeneral]);

  // Merge all results and remove duplicates while keep sorting
  const issues: Issue[] = [];
  [...(resExact ?? []), ...(resPersonalized ?? []), ...(resGeneral ?? [])].forEach(issue => {
    if (!issues.find(i => i.id === issue.id)) {
      issues.push(issue);
    }
  });

  // Add all projects to local projects atom
  issues
    .map(issue => issue.fields.project as JiraProject)
    .map(project => createNewLocalProject(project))
    .forEach(project => {
      store.set(upsertProjectAtom, project);
      loadAvatarForProject(project);
    });

  return issues;
}

export function createRemoteWorklog(worklog: Worklog) {
  return jiraClient.issueWorklogs.addWorklog({
    issueIdOrKey: worklog.issue.id,
    started: formatDateToJiraFormat(parseDateFromYYYYMMDD(worklog.started)),
    timeSpentSeconds: worklog.timeSpentSeconds,
    comment: convertMdToAdf(worklog.comment),
  });
}

export function updateRemoteWorklog(worklog: Worklog) {
  return jiraClient.issueWorklogs.updateWorklog({
    issueIdOrKey: worklog.issue.id,
    id: worklog.id,
    started: formatDateToJiraFormat(parseDateFromYYYYMMDD(worklog.started)),
    timeSpentSeconds: worklog.timeSpentSeconds,
    comment: convertMdToAdf(worklog.comment),
  });
}

export function deleteRemoteWorklog(worklog: Worklog) {
  return jiraClient.issueWorklogs.deleteWorklog({
    issueIdOrKey: worklog.issue.id,
    id: worklog.id,
  });
}

export function getIssueByKey(issueKey: string) {
  return jiraClient.issueSearch
    .searchForIssuesUsingJqlPost({
      jql: `key = "${issueKey.toUpperCase()}"`,
      fields: ['summary', 'id'],
      maxResults: 1,
    })
    .then(res => res.issues?.[0]);
}
