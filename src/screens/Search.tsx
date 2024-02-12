import { SearchResults } from 'jira.js/out/version3/models';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import React, { FC, useEffect, useState } from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { addWorklogAtom, currentOverlayAtom, selectedDateAtom, themeAtom } from '../atoms';
import { CustomTextInput } from '../components/CustomTextInput';
import { Layout } from '../components/Layout';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { SearchResultsEntry } from '../components/SearchResultsEntry';
import { Overlay } from '../const';
import { formatDateToYYYYMMDD } from '../services/date.service';
import { getIssuesBySearchQuery } from '../services/jira.service';
import { useThemedStyles } from '../services/theme.service';
import { createNewWorklogForIssue } from '../services/worklog.service';
import { Theme } from '../styles/theme/theme-types';
import { typo } from '../styles/typo';

const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export const Search: FC = () => {
  const setSelectedDate = useSetAtom(selectedDateAtom);
  const addWorklog = useSetAtom(addWorklogAtom);
  const [currentOverlay, setCurrentOverlay] = useAtom(currentOverlayAtom);
  const [searchValue, setSearchValue] = useState('');
  const [searchIsLoading, setSearchIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResults>();
  const theme = useAtomValue(themeAtom);
  const styles = useThemedStyles(createStyles);
  const hasCharacters = searchValue.trim().length > 0;
  const enoughCharacters = searchValue.trim().length >= 3;

  const debouncedSearch = debounce(async (query: string) => {
    setSearchIsLoading(true);
    try {
      setSearchResults(await getIssuesBySearchQuery(query));
    } catch (e) {
      console.error('Error while searching', e);
    } finally {
      setSearchIsLoading(false);
    }
  }, 250);

  useEffect(() => {
    const trimmedValue = searchValue.trim();
    if (!trimmedValue || trimmedValue.length < 3) {
      return;
    }
    debouncedSearch(trimmedValue);
  }, [searchValue]);

  return (
    <Layout
      customBackgroundColor={theme.backgroundDrawer}
      header={{
        align: 'left',
        onBackPress: () => setCurrentOverlay(null),
        position: 'absolute',
        title: 'Add new worklog',
      }}>
      <View style={styles.inputContainer}>
        <CustomTextInput
          isVisible={currentOverlay === Overlay.Search}
          placeholder='Search...'
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
      <ScrollView style={styles.entriesContainer} removeClippedSubviews={false}>
        {searchIsLoading && (
          <View style={styles.loadingSpinnerContainer}>
            <LoadingSpinner />
          </View>
        )}
        {!searchIsLoading &&
          searchResults?.issues?.map(issue => (
            <SearchResultsEntry
              key={issue.id}
              issue={issue}
              onPress={() => {
                setCurrentOverlay(null);
                setSelectedDate(formatDateToYYYYMMDD(new Date()));
                addWorklog(createNewWorklogForIssue({ issue }));
              }}
            />
          ))}
        {hasCharacters && !enoughCharacters && !searchIsLoading && (
          <Text style={styles.errorMessage}>Please enter at least 3 characters</Text>
        )}
        {enoughCharacters && !searchIsLoading && searchResults?.issues?.length === 0 && (
          <Text style={styles.errorMessage}>No search results found</Text>
        )}
      </ScrollView>
    </Layout>
  );
};

function createStyles(theme: Theme) {
  return StyleSheet.create({
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
}
