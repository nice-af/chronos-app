import { ReactNode } from 'react';
import { ViewStyle } from 'react-native';
import { UUID } from './accounts.types';

export type Layout = 'normal' | 'compact' | 'micro';
export type DayCode = 'mo' | 'tu' | 'we' | 'th' | 'fr' | 'sa' | 'su';
export const weekDays: DayCode[] = ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'];

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
