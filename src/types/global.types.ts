import { ReactNode } from 'react';
import { ViewStyle } from 'react-native';
import { UUID } from './accounts.types';

export type Layout = 'normal' | 'compact' | 'micro';
export type DayId = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type DayCode = 'mo' | 'tu' | 'we' | 'th' | 'fr' | 'sa' | 'su';

export const dayCodeToDayIdMap: Record<DayCode, DayId> = {
  mo: 0,
  tu: 1,
  we: 2,
  th: 3,
  fr: 4,
  sa: 5,
  su: 6,
};

export const weekDays: {
  id: DayId;
  code: DayCode;
}[] = [
  { id: 0, code: 'mo' },
  { id: 1, code: 'tu' },
  { id: 2, code: 'we' },
  { id: 3, code: 'th' },
  { id: 4, code: 'fr' },
  { id: 5, code: 'sa' },
  { id: 6, code: 'su' },
];

export enum WorklogState {
  LOCAL = 'local',
  SYNCED = 'synced',
  EDITED = 'edited',
}

export type ProjectKey = string;
export type IssueKey = `${ProjectKey}-${number}`;

export interface IssueBase {
  id: string;
  key: IssueKey;
  summary: string;
}

export type WorklogId = string;

export interface Worklog {
  id: WorklogId;
  issue: IssueBase;
  started: string;
  timeSpentSeconds: number;
  comment: string;
  state: WorklogState;
  uuid: UUID;
}

export interface Project {
  id: string;
  /**
   * This is an internal property that should not be accessed directly.
   * It's used to initially load the avatar of the project.
   *
   * @internal
   */
  _avatarUrl: string | null;
  /**
   * Base64 encoded image or `null` if avatar was not loaded yet
   */
  avatar: string | null;
  key: ProjectKey;
  name: string;
  /**
   * UUID of the account this project belongs to
   */
  uuid: UUID;
  /**
   * Timestamp of the last update of this project. Used to clean up old projects.
   */
  updatedAt: number;
}

/**
 * Projects are stored in a nested object with the UUID of the account as the first key
 * and the project id as the second key.
 */
export type ProjectsAtom = Partial<Record<UUID, Record<ProjectKey, Project>>>;

export interface CustomButtonProps {
  label?: string;
  onPress: () => void;
  style?: ViewStyle;
  iconRight?: ReactNode;
}
