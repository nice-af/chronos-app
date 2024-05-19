import { ReactNode } from 'react';
import { ViewStyle } from 'react-native';

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

export interface IssueBase {
  id: string;
  key: string;
  summary: string;
}

export interface Worklog {
  id: string;
  issue: IssueBase;
  started: string;
  timeSpentSeconds: number;
  comment: string;
  state: WorklogState;
}

export interface Project {
  id: string;
  /**
   * This is an internal property that should not be accessed directly.
   * It's used to initially load the avatar of the project.
   *
   * @internal
   */
  _avatarUrl: string;
  /**
   * Base64 encoded image or `null` if avatar was not loaded yet
   */
  avatar: string | null;
  key: string;
  name: string;
}

export interface CustomButtonProps {
  label?: string;
  onPress: () => void;
  style?: ViewStyle;
  iconRight?: ReactNode;
}
