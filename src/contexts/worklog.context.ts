import React from 'react';
import { Worklog } from '../types/global.types';

interface WorklogContextProps {
  worklogs: Worklog[];
  addWorklog: (worklog: Worklog) => void;
  updateWorklog: (worklog: Worklog) => void;
  deleteWorklog: (worklogId: string) => Promise<void>;
  syncWorklogsForCurrentDay: () => void;
  worklogsForCurrentDay: Worklog[];
  setActiveWorklogId: (worklogId: string | null) => void;
  // Id of the worklog we are currently tracking time for
  activeWorklogId: string | null;
  // Amount of time elapsed for the active worklog
  activeWorklogTimeElapsed: number;
}

export const WorklogContext = React.createContext<WorklogContextProps>({
  worklogs: [],
  addWorklog: () => {},
  updateWorklog: () => {},
  deleteWorklog: async () => {},
  syncWorklogsForCurrentDay: () => {},
  worklogsForCurrentDay: [],
  setActiveWorklogId: () => {},
  activeWorklogId: null,
  activeWorklogTimeElapsed: 0,
});
