import React, { useContext, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CustomTextInput } from '../components/CustomTextInput';
import { Layout } from '../components/Layout';
import { TrackingListEntry } from '../components/TrackingListEntry';
import { GlobalContext } from '../contexts/global.context';
import { NavigationContext } from '../contexts/navigation.context';
import { formatDateToYYYYMMDD } from '../services/date.service';
import { useThemedStyles } from '../services/theme.service';
import { Theme } from '../styles/theme/theme-types';
import { typo } from '../styles/typo';

export const Search: React.FC = () => {
  const { worklogs } = useContext(GlobalContext);
  const { selectedDate, showSearchScreen, setShowSearchScreen } = useContext(NavigationContext);
  const [searchValue, setSearchValue] = useState('');
  const styles = useThemedStyles(createStyles);
  const currentWorklogs = (worklogs ?? {})[formatDateToYYYYMMDD(selectedDate)]?.worklogs ?? [];

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
      marginTop: 53,
      borderBottomColor: theme.border,
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
