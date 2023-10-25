import { Issue, Worklog } from 'jira.js/out/version3/models';

export type Screen = 'login' | 'dayView';

export type Project = 'tmh' | 'orcaya' | 'solid';

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

export interface WorklogCompact {
  id: string;
  issueKey: string;
  issueSummary: string;
  started: string;
  timeSpent: number;
  comment?: string;
}

export interface WorklogDaysObject {
  [key: string]: {
    worklogs: WorklogCompact[];
    totalTimeSpent: number;
  };
}
