import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import React, { FC } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { currentOverlayAtom, logoutAtom, settingsAtom, themeAtom } from '../atoms';
import { ButtonDanger } from '../components/ButtonDanger';
import { CardsSelectionButton } from '../components/CardsSelectionButton';
import { Layout } from '../components/Layout';
import { Toggle } from '../components/Toggle';
import { WorkingDaysSetting } from '../components/WorkingDaysSetting';
import { SidebarLayout } from '../const';
import { useThemedStyles } from '../services/theme.service';
import { Theme } from '../styles/theme/theme-types';
import { typo } from '../styles/typo';

export const Settings: FC = () => {
  const logout = useSetAtom(logoutAtom);
  const [settings, setSettings] = useAtom(settingsAtom);
  const setCurrentOverlay = useSetAtom(currentOverlayAtom);
  const styles = useThemedStyles(createStyles);
  const theme = useAtomValue(themeAtom);

  return (
    <Layout
      customBackgroundColor={theme.backgroundDrawer}
      header={{ align: 'left', title: 'Settings', onBackPress: () => setCurrentOverlay(null) }}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.headline}>Sidebar layout</Text>
          <View style={styles.cardsButtonContainer}>
            <CardsSelectionButton
              isChecked={settings.sidebarLayout === 'normal'}
              onClick={() => setSettings(cur => ({ ...cur, sidebarLayout: SidebarLayout.Normal }))}
              image={
                theme.type === 'light'
                  ? require('../assets/settings/layout-normal-light.png')
                  : require('../assets/settings/layout-normal-dark.png')
              }
              label='Normal'
            />
            <CardsSelectionButton
              isChecked={settings.sidebarLayout === 'compact'}
              onClick={() => setSettings(cur => ({ ...cur, sidebarLayout: SidebarLayout.Compact }))}
              image={
                theme.type === 'light'
                  ? require('../assets/settings/layout-compact-light.png')
                  : require('../assets/settings/layout-compact-dark.png')
              }
              label='Compact'
            />
            <CardsSelectionButton
              isChecked={settings.sidebarLayout === 'micro'}
              onClick={() => setSettings(cur => ({ ...cur, sidebarLayout: SidebarLayout.Micro }))}
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
          <Toggle
            label='Hide non working days'
            state={settings.hideNonWorkingDays}
            setState={newState => setSettings(cur => ({ ...cur, hideNonWorkingDays: newState }))}
          />
        </View>
        <View style={styles.card}>
          <Text style={styles.headline}>Worklogs</Text>
          <Toggle
            label='Disable editing of worklogs from past days'
            state={settings.disableEditingOfPastWorklogs}
            setState={newState => setSettings(cur => ({ ...cur, disableEditingOfPastWorklogs: newState }))}
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
