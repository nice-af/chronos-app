export interface GetOauthTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: 'Bearer';
}

export type GetAccessibleResourcesResponse = JiraResource[];

export interface JiraResource {
  id: string;
  url: string;
  name: string;
  scopes: string[];
  avatarUrl: string;
}
