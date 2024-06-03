import { JIRA_CREATE_WORKLOG_URI } from '@env';
import { useSetAtom } from 'jotai';
import { FC, useEffect } from 'react';
import { Linking } from 'react-native';
import { addWorklog, currentOverlayAtom, currentWorklogToEditAtom, selectedDateAtom } from '../atoms';
import { Overlay } from '../const';
import { formatDateToYYYYMMDD } from '../services/date.service';
import { getIssueByKey } from '../services/jira-issues.service';
import { createNewLocalWorklog } from '../services/worklog.service';
import { getUrlParams } from '../utils/url';
import { AccountId, CloudId } from '../types/accounts.types';
import { getUUID } from '../services/account.service';

export const WorklogDeepLinkWatcher: FC = () => {
  const setSelectedDate = useSetAtom(selectedDateAtom);
  const setCurrentOverlay = useSetAtom(currentOverlayAtom);
  const setCurrentWorklogToEdit = useSetAtom(currentWorklogToEditAtom);

  useEffect(() => {
    Linking.addEventListener('url', handleDeepLink);
    return () => {
      Linking.removeAllListeners('url');
    };
  }, []);

  async function handleDeepLink(event: { url: string }) {
    if (!event.url.startsWith(JIRA_CREATE_WORKLOG_URI)) {
      return;
    }

    const { issueKey, accountId: rawAccountId, cloudId: rawCloudId } = getUrlParams(event.url);
    if (!issueKey || !rawAccountId || !rawCloudId) {
      return;
    }

    const accountId = rawAccountId as AccountId;
    const cloudId = rawCloudId as CloudId;
    const uuid = getUUID(accountId, cloudId);

    const issueDetails = await getIssueByKey(issueKey, uuid);
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
      uuid,
    });
    setSelectedDate(todayDateString);
    addWorklog(worklog);
    setCurrentWorklogToEdit(worklog);
    setCurrentOverlay([Overlay.EDIT_WORKLOG]);
  }

  return null;
};
