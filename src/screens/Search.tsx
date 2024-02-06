import React, { useContext, useState, useEffect } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Layout } from '../components/Layout';
import { TrackingListEntry } from '../components/TrackingListEntry';
import { GlobalContext } from '../contexts/global.context';
import { NavigationContext } from '../contexts/navigation.context';
import { formatDateToYYYYMMDD } from '../services/date.service';
import { typo } from '../styles/typo';
import { CustomTextInput } from '../components/CustomTextInput';
import { colors } from '../styles/colors';
import { SearchResults } from 'jira.js/out/version3/models';
import { getIssuesBySearchQuery } from '../services/jira.service';
import { ButtonTransparent } from '../components/ButtonTransparent';
import { IssueTag } from '../components/IssueTag';

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

  console.log('searchResults', searchResults);

  return (
    <Layout
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
          iconLeft={<Image style={styles.icon} source={require('../assets/icon-search.png')} />}
        />
      </View>
      <ScrollView style={styles.entriesContainer} removeClippedSubviews={false}>
        {/* TODO @AdrianFahrbach make pretty */}
        {searchIsLoading && <Text style={styles.errorMessage}>Searching...</Text>}
        {/* TODO @AdrianFahrbach make pretty */}
        {searchResults?.issues?.map(issue => (
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              padding: 10,
              backgroundColor: 'grey',
              borderBottomWidth: 1,
              borderBottomColor: '#fff',
            }}>
            <View>
              <View style={{ display: 'flex', flexDirection: 'row' }}>
                <IssueTag label={issue.key} project='orcaya' />
                <Text> &gt; {issue.fields.project.name}</Text>
              </View>
              <Text>{issue.fields.summary}</Text>
            </View>
            <ButtonTransparent onPress={() => setShowSearchScreen(true)}>
              <Image style={styles.icon} source={require('../assets/icon-plus.png')} />
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

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    height: 52,
    flexBasis: 52,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 53,
    borderBottomColor: colors.border,
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
