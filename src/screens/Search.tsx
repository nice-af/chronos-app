import { Issue } from 'jira.js/out/version3/models';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Image, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  addWorklog,
  currentOverlayAtom,
  currentWorklogToEditAtom,
  loginsAtom,
  selectedDateAtom,
  themeAtom,
  worklogsAtom,
} from '../atoms';
import { CustomTextInput } from '../components/CustomTextInput';
import { Layout } from '../components/Layout';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { SearchResultsEntry } from '../components/SearchResultsEntry';
import { TabData, Tabs } from '../components/Tabs';
import { Overlay } from '../const';
import { formatDateToYYYYMMDD } from '../services/date.service';
import { useTranslation } from '../services/i18n.service';
import { getIssuesBySearchQuery } from '../services/jira-issues.service';
import { getModalConfirmation } from '../services/modal.service';
import { useThemedStyles } from '../services/theme.service';
import { createNewLocalWorklog } from '../services/worklog.service';
import { Theme } from '../styles/theme/theme-types';
import { typo } from '../styles/typo';
import { UUID } from '../types/accounts.types';
import { IssueBase, Worklog } from '../types/global.types';

function debounce(func: (...args: any[]) => void, delay: number) {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      func(...args);
    }, delay);
  };
}

type IssueWithUUID = Issue & { uuid: UUID };

export const Search: FC = () => {
  const selectedDate = useAtomValue(selectedDateAtom);
  const logins = useAtomValue(loginsAtom);
  const [currentOverlay, setCurrentOverlay] = useAtom(currentOverlayAtom);
  const setCurrentWorklogToEdit = useSetAtom(currentWorklogToEditAtom);
  const [searchValue, setSearchValue] = useState('');
  const initialUUID = logins.find(acc => acc.isPrimary)?.uuid ?? logins[0]?.uuid;
  const [uuid, setUUID] = useState<UUID>(initialUUID);
  const lastUUID = useRef<UUID>(initialUUID);
  const [searchIsLoading, setSearchIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<IssueWithUUID[]>([]);
  const theme = useAtomValue(themeAtom);
  const styles = useThemedStyles(createStyles);
  const hasCharacters = searchValue.trim().length > 0;
  const enoughCharacters = searchValue.trim().length >= 3;
  const { t } = useTranslation();
  const worklogs = useAtomValue(worklogsAtom);
  const fadeInAnim = useRef(new Animated.Value(0)).current;

  async function search(query: string, targetUUID: UUID) {
    setSearchIsLoading(true);
    try {
      const newResults = (await getIssuesBySearchQuery(query, targetUUID)).map(issue => ({
        ...issue,
        uuid: targetUUID,
      }));
      setSearchResults(newResults);
      fadeInAnim.setValue(0);
      Animated.timing(fadeInAnim, {
        toValue: 26,
        duration: 800,
        useNativeDriver: true,
      }).start();
    } catch (e) {
      console.error('Error while searching', e);
    } finally {
      setSearchIsLoading(false);
    }
  }
  const debouncedSearch = useMemo(() => debounce(search, 500), []);

  useEffect(() => {
    const trimmedValue = searchValue.trim();
    if (!trimmedValue || trimmedValue.length < 3) {
      setSearchResults([]);
      return;
    }
    if (uuid !== lastUUID.current) {
      void search(trimmedValue, uuid);
      lastUUID.current = uuid;
    } else {
      debouncedSearch(trimmedValue, uuid);
    }
  }, [searchValue, uuid]);

  // Clear search results when switching between tabs
  useEffect(() => {
    setSearchResults([]);
  }, [uuid]);

  /**
   * List of worklogs that have been worked on most recently.
   * This allows the user to quickly add a new worklog for an issue they have worked on recently without searching.
   */
  const latestWorklogsWorkedOn: Worklog[] = useMemo(() => {
    const maxWorklogsShown = 12;
    const latestWorklogs: Worklog[] = [];

    worklogs
      .sort((a, b) => {
        if (a.started === b.started) {
          return b.id.localeCompare(a.id);
        }
        return b.started.localeCompare(a.started);
      })
      .forEach(worklog => {
        const alreadyInList = latestWorklogs.some(w => w.issue.key === worklog.issue.key);
        if (alreadyInList || latestWorklogs.length > maxWorklogsShown) {
          return;
        }
        latestWorklogs.push(worklog);
      });

    return latestWorklogs;
  }, [worklogs]);

  async function handleOnWorklogStart(issueBase: IssueBase) {
    if (formatDateToYYYYMMDD(new Date()) !== selectedDate) {
      const isInFuture = new Date() < new Date(selectedDate);
      const confirmed = await getModalConfirmation({
        icon: 'timer-warning',
        headline: isInFuture ? t('modals.startTimerInFutureHeadline') : t('modals.startTimerInPastHeadline'),
        text: isInFuture ? t('modals.startTimerInFutureText') : t('modals.startTimerInPastText'),
      });
      if (!confirmed) {
        return;
      }
    }
    const worklog = createNewLocalWorklog({
      issue: {
        id: issueBase.id,
        key: issueBase.key,
        summary: issueBase.summary,
      },
      started: selectedDate,
      uuid,
    });
    addWorklog(worklog);
    setCurrentWorklogToEdit(worklog);
    setCurrentOverlay([Overlay.SEARCH, Overlay.EDIT_WORKLOG]);
    setTimeout(() => setCurrentOverlay([Overlay.EDIT_WORKLOG]), 500);
  }

  const tabs: TabData[] = useMemo(
    () =>
      logins.map(login => ({
        label: login.workspaceDisplayName,
        userImageSrc: logins.some(acc => acc.workspaceName === login.workspaceName && acc.accountId !== login.accountId)
          ? login.avatarUrl
          : undefined,
        workspaceUrl: login.workspaceUrl,
        onPress: () => setUUID(login.uuid),
      })),
    [logins]
  );
  const hasTabs = tabs.length > 1;

  return (
    <Layout
      customBackgroundColor={theme.backgroundDrawer}
      header={{
        align: 'left',
        onBackPress: () => setCurrentOverlay(null),
        position: 'absolute',
        title: t('worklogs.addNewWorklog'),
      }}>
      <View style={[styles.inputContainer, !hasTabs && styles.inputContainerWithoutTabs]}>
        <CustomTextInput
          isVisible={!!currentOverlay && currentOverlay.includes(Overlay.SEARCH)}
          placeholder={t('search.placeholder')}
          value={searchValue}
          onChangeText={setSearchValue}
          iconLeft={
            <Image
              style={styles.icon}
              source={
                theme.type === 'light'
                  ? require('../assets/icons/search-light.png')
                  : require('../assets/icons/search-dark.png')
              }
            />
          }
        />
      </View>
      {hasTabs && <Tabs tabs={tabs} />}
      <ScrollView style={styles.entriesContainer} removeClippedSubviews={false}>
        {searchIsLoading && (
          <View style={styles.loadingSpinnerContainer}>
            <LoadingSpinner />
          </View>
        )}
        {hasCharacters && !enoughCharacters && !searchIsLoading && (
          <Text style={styles.errorMessage}>{t('search.error.minLength')}</Text>
        )}
        {enoughCharacters && !searchIsLoading && searchResults?.length === 0 && (
          <Text style={styles.errorMessage}>{t('search.error.noResults')}</Text>
        )}
        {!searchIsLoading &&
          searchResults?.map((issue, index) => (
            <Animated.View
              key={`issue-${issue.id}`}
              style={{
                opacity:
                  index > 20
                    ? 1
                    : fadeInAnim.interpolate({
                        inputRange: [index, index + 6],
                        outputRange: [0, 1],
                      }),
              }}>
              <SearchResultsEntry
                issue={{
                  id: issue.id,
                  key: issue.key,
                  project: {
                    name: issue.fields.project.name,
                  },
                  summary: issue.fields.summary,
                  uuid: issue.uuid,
                }}
                onPress={() => handleOnWorklogStart({ id: issue.id, key: issue.key, summary: issue.fields.summary })}
              />
            </Animated.View>
          ))}
        {!hasCharacters &&
          latestWorklogsWorkedOn.map(worklog => (
            <SearchResultsEntry
              key={`worklog-${worklog.id}`}
              issue={{
                id: worklog.issue.id,
                key: worklog.issue.key,
                project: {
                  // TODO persist project name in worklog or persist id and get project name some other way
                  name: '',
                },
                summary: worklog.issue.summary,
                uuid: worklog.uuid,
              }}
              onPress={() =>
                handleOnWorklogStart({
                  id: worklog.issue.id,
                  key: worklog.issue.key,
                  summary: worklog.issue.summary,
                })
              }
            />
          ))}
      </ScrollView>
    </Layout>
  );
};

function createStyles(theme: Theme) {
  // This needs to be assigned to `styles` for react-native/no-unused-styles to work
  const styles = StyleSheet.create({
    inputContainer: {
      width: '100%',
      height: 52,
      flexBasis: 52,
      paddingHorizontal: 16,
      paddingVertical: 8,
      ...Platform.select({
        default: {
          marginTop: 53,
        },
        windows: {
          marginTop: 44,
        },
      }),
    },
    inputContainerWithoutTabs: {
      borderColor: theme.border,
      borderBottomWidth: 1,
    },
    icon: {
      width: 16,
      height: 16,
    },
    entriesContainer: {
      flexGrow: 1,
      overflow: 'visible',
    },
    loadingSpinnerContainer: {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      marginTop: 98,
    },
    errorMessage: {
      ...typo.body,
      textAlign: 'center',
      opacity: 0.4,
      marginTop: 100,
    },
  });
  return styles;
}
