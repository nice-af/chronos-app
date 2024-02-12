import { AxiosInstance } from 'axios';
import { Config, Version3Client } from 'jira.js';
import { Issue, Worklog as JiraWorklog } from 'jira.js/out/version3/models';
import ms from 'ms';
import { Worklog, WorklogState } from '../types/global.types';
import { extractTextFromJSON } from './atlassian-document-format.service';
import { refreshAccessToken } from './auth.service';
import { formatDateToJiraFormat, formatDateToYYYYMMDD, parseDateFromYYYYMMDD } from './date.service';
import { StorageKey, setInStorage } from './storage.service';

// TODO: Use a more lightweight client
// import { Issues } from 'jira.js/out/version3';
// export class CustomJiraClient extends BaseClient {
//   issues = new Issues(this);
// }

let client: Version3Client;

export function getJiraClient() {
  return client;
}

/**
 * Creates a new Jira client instance
 * @param cloudId Cloud ID of the Jira instance
 * @param accessToken The bearer token to use for authentication
 */
export function initiateJiraClient({
  cloudId,
  accessToken,
  refreshToken,
}: {
  cloudId: string;
  accessToken: string;
  refreshToken: string;
}) {
  let currentRefreshToken = refreshToken;
  client = new Version3Client({
    host: `https://api.atlassian.com/ex/jira/${cloudId}`,
    authentication: {
      oauth2: { accessToken },
    },
  });

  // @ts-expect-error (we are accessing a private property here, but it's the only way to access the underlying Axios instance)
  const axiosInstance = client.instance as AxiosInstance;
  axiosInstance.interceptors.response.use(
    response => response,
    async error => {
      const status = error.response ? error.response.status : null;

      if (status === 401) {
        const freshTokens = await refreshAccessToken(currentRefreshToken);

        await setInStorage(StorageKey.AUTH, {
          cloudId,
          accessToken: freshTokens.access_token,
          refreshToken: freshTokens.refresh_token,
        });

        // Set new token in for this request
        error.config.headers.Authorization = `Bearer ${freshTokens.access_token}`;

        // Set new token for all upcoming requests
        // @ts-expect-error (we are accessing a protected property here, but it's the only way to update the token in the client instance)
        (client.config! as Config).authentication.oauth2.accessToken = freshTokens.access_token;
        currentRefreshToken = freshTokens.refresh_token;

        return axiosInstance.request(error.config);
      }

      return Promise.reject(error);
    }
  );

  return client;
}

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
      comment: worklog.comment ? extractTextFromJSON(worklog.comment) : '',
      state: WorklogState.Synced,
    }));
}

/**
 * Gets all worklogs of the last month of the current user
 */
export async function getWorklogs(accountId: string): Promise<Worklog[]> {
  if (!client) {
    throw new Error('Jira client not initialized');
  }

  const startedAfterTimestamp = new Date().getTime() - ms('4w');

  const worklogsCompact: Worklog[] = [];
  const jqlQuery = `worklogAuthor = ${accountId} AND worklogDate > -4w`;
  const maxIssuesResults = 40;
  let totalIssues = 1;
  let issuesFailsafe = 0;

  // Loop through all issues with recent worklogs
  for (let currentIssue = 0; currentIssue < totalIssues; issuesFailsafe++) {
    const issuesCall = await client.issueSearch.searchForIssuesUsingJqlPost({
      jql: jqlQuery,
      fields: ['summary', 'worklog'],
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
          const worklogsCall = await client.issueWorklogs.getIssueWorklog({
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
 * Gets all issues that match a given search query
 */
export async function getIssuesBySearchQuery(query: string) {
  if (!client) {
    throw new Error('Jira client not initialized');
  }
  return await client.issueSearch.searchForIssuesUsingJqlPost({
    jql: `summary ~ "${query}" OR description ~ "${query}" ORDER BY created DESC`,
    fields: ['summary', 'project'],
    maxResults: 50,
  });
}

export async function createWorklog(worklog: Worklog) {
  if (!client) {
    throw new Error('Jira client not initialized');
  }

  return await client.issueWorklogs.addWorklog({
    issueIdOrKey: worklog.issue.id,
    started: formatDateToJiraFormat(parseDateFromYYYYMMDD(worklog.started)),
    timeSpentSeconds: worklog.timeSpentSeconds,
    comment: worklog.comment,
  });
}

export async function updateWorklog(worklog: Worklog) {
  if (!client) {
    throw new Error('Jira client not initialized');
  }

  return await client.issueWorklogs.updateWorklog({
    issueIdOrKey: worklog.issue.id,
    id: worklog.id,
    started: formatDateToJiraFormat(parseDateFromYYYYMMDD(worklog.started)),
    timeSpentSeconds: worklog.timeSpentSeconds,
    comment: worklog.comment,
  });
}

export async function deleteWorklog(worklog: Worklog) {
  if (!client) {
    throw new Error('Jira client not initialized');
  }

  return await client.issueWorklogs.deleteWorklog({
    issueIdOrKey: worklog.issue.id,
    id: worklog.id,
  });
}
