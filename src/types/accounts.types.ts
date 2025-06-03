import { Version3Client } from 'jira.js';
import { ColorOption } from '../styles/theme/theme-types';

// The AccountId and CloudId don't actually start with "accountId" or "cloudId",
// but we need to prefix them to avoid conflicts with other types.
export type AccountId = `accountId${string}accountId`; // Identifies a Jira account
export type CloudId = `cloudId${string}cloudId`; // Identifies a Jira instance
export type UUID = `${AccountId}__${CloudId}`; // Unique identifier for a combination of account and instance

/**
 * A login always consists of a Jira account and a Jira instance.
 * Basically an account of this app, including account specific settings. This is not the same as a Jira account.
 */
export type LogoType = 'navbarLogo' | 'workspaceLogo';

export interface LoginModel {
  uuid: UUID;
  accountId: AccountId;
  cloudId: CloudId;
  name: string;
  avatarUrl: string;
  workspaceUrl: string;
  workspaceName: string;
  workspaceDisplayName: string;
  workspaceAvatarUrl: string;
  selectedLogo: LogoType;
  workspaceColor: ColorOption;
  customWorkspaceColor?: string;
  isPrimary: boolean;
}

/**
 * A Jira account's access and refresh token.
 * Since a single Jira account can be connected to multiple Jira instances with the same access token,
 * we need to store the tokens separately from the account data.
 */
export interface JiraAccountTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export type LoginsAtom = LoginModel[];
export type JiraAccountTokensAtom = Record<AccountId, JiraAccountTokens>;
export type JiraClientsAtom = Record<UUID, Version3Client>;
