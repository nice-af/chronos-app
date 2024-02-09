import React, { FC, useContext } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { ButtonDanger } from '../components/ButtonDanger';
import { CardsSelectionButton } from '../components/CardsSelectionButton';
import { Layout } from '../components/Layout';
import { Toggle } from '../components/Toggle';
import { WorkingDaysSetting } from '../components/WorkingDaysSetting';
import { GlobalContext } from '../contexts/global.context';
import { NavigationContext } from '../contexts/navigation.context';
import { ThemeContext } from '../contexts/theme.context';
import { useThemedStyles } from '../services/theme.service';
import { Theme } from '../styles/theme/theme-types';
import { typo } from '../styles/typo';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const Settings: FC = () => {
  const {
    disableEditingOfPastWorklogs,
    setDisableEditingOfPastWorklogs,
    hideNonWorkingDays,
    setHideNonWorkingDays,
    logout,
  } = useContext(GlobalContext);
  const { setShowSettingsScreen } = useContext(NavigationContext);
  const styles = useThemedStyles(createStyles);
  const { layout, setLayout } = useContext(GlobalContext);
  const { theme } = useContext(ThemeContext);

  return (
    <Layout
      customBackgroundColor={theme.backgroundDrawer}
      header={{ align: 'left', title: 'Settings', onBackPress: () => setShowSettingsScreen(false) }}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.headline}>Sidebar layout</Text>
          <View style={styles.cardsButtonContainer}>
            <CardsSelectionButton
              isChecked={layout === 'normal'}
              onClick={() => setLayout('normal')}
              image={
                theme.type === 'light'
                  ? require('../assets/settings/layout-normal-light.png')
                  : require('../assets/settings/layout-normal-dark.png')
              }
              label='Normal'
            />
            <CardsSelectionButton
              isChecked={layout === 'compact'}
              onClick={() => setLayout('compact')}
              image={
                theme.type === 'light'
                  ? require('../assets/settings/layout-compact-light.png')
                  : require('../assets/settings/layout-compact-dark.png')
              }
              label='Compact'
            />
            <CardsSelectionButton
              isChecked={layout === 'micro'}
              onClick={() => setLayout('micro')}
              image={
                theme.type === 'light'
                  ? require('../assets/settings/layout-micro-light.png')
                  : require('../assets/settings/layout-micro-dark.png')
              }
              label='Micro'
            />
          </View>
          <View style={styles.hr} />
          <Text style={styles.headline}>Working days</Text>
          <WorkingDaysSetting />
          <View style={styles.hr} />
          <Toggle label='Hide non working days' state={hideNonWorkingDays} setState={setHideNonWorkingDays} />
        </View>
        <View style={styles.card}>
          <Text style={styles.headline}>Worklogs</Text>
          <Toggle
            label='Disable editing of worklogs from past days'
            state={disableEditingOfPastWorklogs}
            setState={setDisableEditingOfPastWorklogs}
          />
        </View>
        <View style={styles.card}>
          <Text style={styles.headline}>Account</Text>
          <ButtonDanger label='Logout' onPress={logout} />
        </View>
      </View>
    </Layout>
  );
};

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      justifyContent: 'flex-start',
      padding: 16,
      gap: 16,
      ...Platform.select({
        windows: {
          paddingTop: 8,
        },
      }),
    },
    card: {
      padding: 10,
      backgroundColor: theme.surface,
      borderColor: theme.surfaceBorder,
      borderWidth: 1,
      borderRadius: 5,
    },
    headline: {
      ...typo.headline,
      color: theme.textPrimary,
      marginBottom: 12,
    },
    cardsButtonContainer: {
      display: 'flex',
      gap: 10,
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    hr: {
      width: '100%',
      height: 1,
      backgroundColor: theme.surfaceBorder,
      marginVertical: 12,
    },
  });
}
