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
