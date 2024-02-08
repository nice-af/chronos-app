export type Layout = 'normal' | 'compact' | 'micro';
export type Project = 'tmh' | 'orcaya' | 'solid';
export type DayId = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type DayLabel = 'Mo' | 'Tu' | 'We' | 'Th' | 'Fr' | 'Sa' | 'Su';

export const dayLabelToDayIdMap: Record<DayLabel, DayId> = {
  Mo: 0,
  Tu: 1,
  We: 2,
  Th: 3,
  Fr: 4,
  Sa: 5,
  Su: 6,
};

export const weekDays: {
  id: DayId;
  abbreviation: DayLabel;
}[] = [
  { id: 0, abbreviation: 'Mo' },
  { id: 1, abbreviation: 'Tu' },
  { id: 2, abbreviation: 'We' },
  { id: 3, abbreviation: 'Th' },
  { id: 4, abbreviation: 'Fr' },
  { id: 5, abbreviation: 'Sa' },
  { id: 6, abbreviation: 'Su' },
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
  Local = 'local',
  Synced = 'synced',
  Edited = 'edited',
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
