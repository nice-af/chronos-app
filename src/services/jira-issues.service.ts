import { Issue, Project as JiraProject } from 'jira.js/src/version3/models';
import { getJiraClientByUUID } from '../atoms';
import { UUID } from '../types/accounts.types';
import { upsertProjectByJiraProject } from './project.service';

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
export async function getIssuesBySearchQuery(query: string, uuid: UUID) {
  const jiraClient = getJiraClientByUUID(uuid);
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
        .searchForIssuesUsingJqlEnhancedSearch({
          ...commonOptions,
          jql: `key = "${query.toUpperCase()}" ORDER BY ${orderBy}`,
        })
        .then(res => res.issues)
        .catch(e => console.error(`Failed to execute search type "exact" on query "${query}"`, e))
    : Promise.resolve([]);
  const reqPersonalized = jiraClient.issueSearch
    .searchForIssuesUsingJqlEnhancedSearch({
      ...commonOptions,
      jql: `text ~ "${query}*" AND issue in issueHistory() ORDER BY ${orderBy}`,
    })
    .then(res => res.issues)
    .catch(e => console.error(`Failed to execute search type "personalized" on query "${query}"`, e));
  const reqGeneral = jiraClient.issueSearch
    .searchForIssuesUsingJqlEnhancedSearch({
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
  await upsertIssuesProject(issues, uuid);

  return issues;
}

/**
 * Gets an issue by its key. There should always be only one issue with a given key.
 */
export async function getIssueByKey(issueKey: string, uuid: UUID) {
  const jiraClient = getJiraClientByUUID(uuid);
  return jiraClient.issueSearch
    .searchForIssuesUsingJqlEnhancedSearch({
      jql: `key = "${issueKey.toUpperCase()}"`,
      fields: ['summary', 'id'],
      maxResults: 1,
    })
    .then(res => res.issues?.[0]);
}

/**
 * Adds all projects to the local atom and loads the avatar for each project.
 */
export async function upsertIssuesProject(issues: Issue[], uuid: UUID) {
  for (const issue of issues) {
    await upsertProjectByJiraProject(issue.fields.project as JiraProject, uuid);
  }
}
