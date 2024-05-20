import { JIRA_CREATE_WORKLOG_URI } from '@env';
import { useAtomValue, useSetAtom } from 'jotai';
import { FC, useEffect } from 'react';
import { Linking } from 'react-native';
import { addWorklogAtom, currentOverlayAtom, currentWorklogToEditAtom, jiraAuthAtom, selectedDateAtom } from '../atoms';
import { Overlay } from '../const';
import { formatDateToYYYYMMDD } from '../services/date.service';
import { getIssueByKey } from '../services/jira.service';
import { createNewLocalWorklog } from '../services/worklog.service';
import { getUrlParams } from '../utils/url';

export const WorklogDeepLinkWatcher: FC = () => {
  const jiraAuth = useAtomValue(jiraAuthAtom);
  const setSelectedDate = useSetAtom(selectedDateAtom);
  const addWorklog = useSetAtom(addWorklogAtom);
  const setCurrentOverlay = useSetAtom(currentOverlayAtom);
  const setCurrentWorklogToEdit = useSetAtom(currentWorklogToEditAtom);

  useEffect(() => {
    if (!jiraAuth) {
      return;
    }
    Linking.addEventListener('url', handleDeepLink);
    return () => {
      Linking.removeAllListeners('url');
    };
  }, [jiraAuth]);

  async function handleDeepLink(event: { url: string }) {
    if (!event.url.startsWith(JIRA_CREATE_WORKLOG_URI)) {
      return;
    }

    const { issueKey } = getUrlParams(event.url);
    if (!issueKey) {
      return;
    }

    const issueDetails = await getIssueByKey(issueKey);
    if (!issueDetails) {
      return;
    }

    const todayDateString = formatDateToYYYYMMDD(new Date());
    const worklog = createNewLocalWorklog({
      issue: {
        id: issueDetails.id,
        key: issueKey,
        summary: issueDetails.fields.summary,
      },
      started: todayDateString,
    });
    setSelectedDate(todayDateString);
    addWorklog(worklog);
    setCurrentWorklogToEdit(worklog);
    setCurrentOverlay([Overlay.EDIT_WORKLOG]);
  }

  return null;
};
