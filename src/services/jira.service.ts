import { Version3Client } from 'jira.js';

// TODO: Use a more lightweight client
// import { Issues } from 'jira.js/out/version3';
// export class CustomJiraClient extends BaseClient {
//   issues = new Issues(this);
// }

let client: Version3Client;

/**
 * Creates a new Jira client instance
 * @param cloudId Cloud ID of the Jira instance
 * @param accessToken The bearer token to use for authentication
 */
export function initiateJiraClient(cloudId: string, accessToken: string) {
  client = new Version3Client({
    host: `https://api.atlassian.com/ex/jira/${cloudId}`,
    authentication: {
      oauth2: {
        accessToken: accessToken,
      },
    },
  });
}

export async function getUserInfo() {
  if (!client) {
    throw new Error('Jira client not initialized');
  }
  return await client.myself.getCurrentUser();
}

export function getWorklogs() {
  if (!client) {
    throw new Error('Jira client not initialized');
  }

  client.issueWorklogs.getIdsOfWorklogsModifiedSince({ since: 1698000015000 });
}
