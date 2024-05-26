export interface GetOauthTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: 'Bearer';
}

export interface GetOauthTokenErrorResponse {
  error: string;
  error_description: string;
}

export type GetAccessibleResourcesResponse = JiraResource[];

export interface JiraResource {
  id: string;
  url: string;
  name: string;
  scopes: string[];
  avatarUrl: string;
}

export type GetUserInfoResponse = JiraUserInfo[];

export interface JiraUserInfo {
  id: '8e37969d-562c-4f29-8e8a-0019f5c645a2';
  url: 'https://jiratimetracker.atlassian.net';
  name: string;
  scopes: string[];
  avatarUrl: string;
}
