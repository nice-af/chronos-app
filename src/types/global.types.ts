export type Layout = 'normal' | 'compact' | 'micro';
export type Project = 'tmh' | 'orcaya' | 'solid';
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

export interface TrackingEntry {
  id: number;
  date: Date;
  project: Project;
  tag: string;
  title: string;
  description?: string;
  // Tracked duration in hours
  duration: number;
}

export enum WorklogState {
  LOCAL = 'local',
  SYNCED = 'synced',
  EDITED = 'edited',
}

export interface Worklog {
  id: string;
  issue: {
    id: string;
    key: string;
    summary: string;
  };
  started: string;
  timeSpentSeconds: number;
  comment: string;
  state: WorklogState;
}
