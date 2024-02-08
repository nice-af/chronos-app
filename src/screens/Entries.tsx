import React, { useContext } from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text } from 'react-native';
import { ButtonTransparent } from '../components/ButtonTransparent';
import { JumpToTodayButton } from '../components/JumpToTodayButton';
import { Layout } from '../components/Layout';
import { TrackingListEntry } from '../components/TrackingListEntry';
import { GlobalContext } from '../contexts/global.context';
import { NavigationContext } from '../contexts/navigation.context';
import { formatDateToYYYYMMDD } from '../services/date.service';
import { useThemedStyles } from '../services/theme.service';
import { Theme } from '../styles/theme/theme-types';
import { typo } from '../styles/typo';
import { ThemeContext } from '../contexts/theme.context';

export const Entries: React.FC = () => {
  const { worklogs, logout } = useContext(GlobalContext);
  const { selectedDate, setShowSearchScreen } = useContext(NavigationContext);
  const { theme } = useContext(ThemeContext);
  const styles = useThemedStyles(createStyles);
  const currentWorklogs = (worklogs ?? {})[formatDateToYYYYMMDD(selectedDate)]?.worklogs ?? [];

  const rightElement = (
    <>
      <JumpToTodayButton />
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
    </>
  );

  return (
    <Layout
      header={{
        align: 'left',
        title: 'Today, 21 Oct',
        rightElement,
        onBackPress: __DEV__ ? () => logout() : undefined,
        position: 'absolute',
      }}>
      <ScrollView
        style={styles.entriesContainer}
        removeClippedSubviews={false}
        contentInset={{ top: Platform.OS === 'windows' ? 0 : 52 + 6, bottom: 6 }}>
        {currentWorklogs.map(worklog => (
          <TrackingListEntry key={worklog.id} worklogCompact={worklog} />
        ))}
        {currentWorklogs.length === 0 && <Text style={styles.errorMessage}>No worklogs for this day yet</Text>}
      </ScrollView>
    </Layout>
  );
};

function createStyles(theme: Theme) {
  return StyleSheet.create({
    icon: {
      width: 24,
      height: 24,
    },
    entriesContainer: {
      flexGrow: 1,
      overflow: 'visible',
      ...Platform.select({
        default: {},
        windows: {
          marginTop: 52 + 6,
          marginBottom: 6,
        },
      }),
    },
    errorMessage: {
      ...typo.body,
      textAlign: 'center',
      opacity: 0.4,
      marginTop: 100,
    },
  });
}
