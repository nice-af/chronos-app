import React, { FC, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../contexts/global.context';
import { NavigationContext } from '../contexts/navigation.context';
import { WorklogContext } from '../contexts/worklog.context';
import { worklogsFakeData } from '../services/fake-data.service';
import * as jiraService from '../services/jira.service';
import { syncWorklogs } from '../services/worklog.service';
import { Worklog, WorklogState } from '../types/global.types';

export const WorklogProvider: FC<PropsWithChildren> = ({ children }) => {
  const [worklogs, setWorklogs] = useState<Worklog[]>([]);
  const [activeWorklogId, setActiveWorklogId] = useState<string | null>(null);
  const [activeWorklogTimeElapsed, setActiveWorklogTimeElapsed] = useState(0);
  const { userInfo } = useContext(GlobalContext);
  const { selectedDate } = useContext(NavigationContext);

  const worklogsForCurrentDay = worklogs.filter(worklog => worklog.started === selectedDate);

  // TODO remove again when basic implemention is stable
  const useFakeData = false;

  useEffect(() => {
    if (useFakeData) {
      setWorklogs(worklogsFakeData);
      return;
    }
    if (userInfo?.accountId) {
      loadWorklogs();
    }
  }, [userInfo?.accountId]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (activeWorklogId) {
      intervalId = setInterval(() => setActiveWorklogTimeElapsed(prev => prev + 1), 1000);
    } else {
      setActiveWorklogTimeElapsed(0);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [activeWorklogId]);

  const addWorklog = (worklog: Worklog) => {
    setWorklogs([...worklogs, worklog]);
    setActiveWorklogId(worklog.id);
  };
  const updateWorklog = (worklog: Worklog) => {
    if (worklog.state !== WorklogState.Local) {
      worklog.state = WorklogState.Edited;
    }
    setWorklogs(worklogs.map(w => (w.id === worklog.id ? worklog : w)));
  };
  const deleteWorklog = async (worklogId: string) => {
    const worklogToDelete = worklogs.find(w => w.id === worklogId);
    setWorklogs(worklogs.filter(w => w.id !== worklogId));
    if (worklogToDelete) {
      await jiraService.deleteWorklog(worklogToDelete);
    }
  };
  const syncWorklogsForCurrentDay = () => {
    syncWorklogs(worklogsForCurrentDay).then(() => loadWorklogs());
  };
  const loadWorklogs = () => {
    jiraService.getWorklogs(userInfo!.accountId).then(setWorklogs);
  };

  console.log('worklogs', worklogs);

  return (
    <WorklogContext.Provider
      value={{
        worklogs,
        addWorklog,
        updateWorklog,
        deleteWorklog,
        syncWorklogsForCurrentDay,
        worklogsForCurrentDay,
        setActiveWorklogId,
        activeWorklogId,
        activeWorklogTimeElapsed,
      }}>
      {userInfo && children}
    </WorklogContext.Provider>
  );
};
