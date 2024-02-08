import { SearchResults } from 'jira.js/out/version3/models';
import React, { useContext, useEffect, useState } from 'react';
import { Image, Platform, PlatformColor, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ButtonTransparent } from '../components/ButtonTransparent';
import { CustomTextInput } from '../components/CustomTextInput';
import { IssueTag } from '../components/IssueTag';
import { Layout } from '../components/Layout';
import { TrackingListEntry } from '../components/TrackingListEntry';
import { GlobalContext } from '../contexts/global.context';
import { NavigationContext } from '../contexts/navigation.context';
import { ThemeContext } from '../contexts/theme.context';
import { formatDateToYYYYMMDD } from '../services/date.service';
import { getIssuesBySearchQuery } from '../services/jira.service';
import { useThemedStyles } from '../services/theme.service';
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

export const Search: React.FC = () => {
  const { worklogs } = useContext(GlobalContext);
  const { selectedDate, showSearchScreen, setShowSearchScreen } = useContext(NavigationContext);
  const [searchValue, setSearchValue] = useState('');
  const [searchIsLoading, setSearchIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResults>();
  const { theme } = useContext(ThemeContext);
  const styles = useThemedStyles(createStyles);
  const currentWorklogs = (worklogs ?? {})[formatDateToYYYYMMDD(selectedDate)]?.worklogs ?? [];

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
        onBackPress: () => setShowSearchScreen(false),
        position: 'absolute',
        title: 'Add new worklog',
      }}>
      <View style={styles.inputContainer}>
        <CustomTextInput
          isVisible={showSearchScreen}
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
        {/* TODO @AdrianFahrbach make pretty */}
        {searchIsLoading && <Text style={styles.errorMessage}>Searching...</Text>}
        {/* TODO @AdrianFahrbach make pretty */}
        {searchResults?.issues?.map(issue => (
          <View
            key={issue.id}
            style={{
              display: 'flex',
              flexDirection: 'row',
              padding: 10,
              backgroundColor: 'grey',
              borderBottomWidth: 1,
              borderColor: '#fff',
            }}>
            <View>
              <View style={{ display: 'flex', flexDirection: 'row' }}>
                <IssueTag label={issue.key} project='orcaya' />
                <Text> &gt; {issue.fields.project.name}</Text>
              </View>
              <Text>{issue.fields.summary}</Text>
            </View>
            <ButtonTransparent onPress={() => setShowSearchScreen(true)}>
              <Image
                style={styles.icon}
                source={
                  theme.type === 'light'
                    ? require('../assets/icons/plus-light.png')
                    : require('../assets/icons/plus-dark.png')
                }
              />
            </ButtonTransparent>
          </View>
        ))}
        {currentWorklogs.map(worklog => (
          <TrackingListEntry key={worklog.id} worklogCompact={worklog} />
        ))}
        {currentWorklogs.length === 0 && <Text style={styles.errorMessage}>No search results found</Text>}
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
    errorMessage: {
      ...typo.body,
      textAlign: 'center',
      opacity: 0.4,
      marginTop: 100,
    },
  });
}
