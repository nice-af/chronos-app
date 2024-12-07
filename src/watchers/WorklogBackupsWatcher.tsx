import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { FC, useEffect } from 'react';
import { loginsAtom, worklogsLocalAtom, worklogsLocalBackupsAtom } from '../atoms';
import { useTranslation } from '../services/i18n.service';
import { getModalConfirmation } from '../services/modal.service';

export const WorklogBackupsWatcher: FC = () => {
  const logins = useAtomValue(loginsAtom);
  const [worklogsLocalBackups, setWorklogsLocalBackups] = useAtom(worklogsLocalBackupsAtom);
  const setWorklogsLocal = useSetAtom(worklogsLocalAtom);
  const { t } = useTranslation();

  useEffect(() => {
    void (async () => {
      const loginsUUIDs = logins.map(login => login.uuid);
      const worklogsLocalBackupsFiltered = worklogsLocalBackups.filter(worklog => loginsUUIDs.includes(worklog.uuid));

      if (worklogsLocalBackupsFiltered.length > 0) {
        const confirmation = await getModalConfirmation({
          icon: 'recover-worklogs',
          headline: t('modals.recoverWorklogsHeadline'),
          text: t('modals.recoverWorklogsText'),
          confirmButtonLabel: t('modals.recover'),
          cancelButtonLabel: t('modals.ignore'),
        });

        if (confirmation) {
          setWorklogsLocal(worklogsLocal => [...worklogsLocal, ...worklogsLocalBackupsFiltered]);
        }
        // We check for all accounts here, but since only one account can change at a time, we can safely remove all backups
        setWorklogsLocalBackups(worklogsLocalBackups.filter(worklog => !loginsUUIDs.includes(worklog.uuid)));
      }
    })();
  }, [logins.length]);
  return null;
};
