export interface GetOauthTokenResponse {
  access_token: string;
  expires_in: number;
  scope: string;
}

export type GetAccessibleResourcesResponse = JiraResource[];

export interface JiraResource {
  id: string;
  url: string;
  name: string;
  scopes: string[];
  avatarUrl: string;
}
