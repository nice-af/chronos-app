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
import { useTranslation } from '../services/i18n.service';
import { useThemedStyles } from '../services/theme.service';
import { Theme } from '../styles/theme/theme-types';
import { typo } from '../styles/typo';

export const Settings: FC = () => {
  const logout = useSetAtom(logoutAtom);
  const [settings, setSettings] = useAtom(settingsAtom);
  const setCurrentOverlay = useSetAtom(currentOverlayAtom);
  const styles = useThemedStyles(createStyles);
  const theme = useAtomValue(themeAtom);
  const { t } = useTranslation();

  return (
    <Layout
      customBackgroundColor={theme.backgroundDrawer}
      header={{ align: 'left', title: t('settings'), onBackPress: () => setCurrentOverlay(null) }}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.headline}>{t('sidebarLayout.settingsTitle')}</Text>
          <View style={styles.cardsButtonContainer}>
            <CardsSelectionButton
              isChecked={settings.sidebarLayout === 'normal'}
              onClick={() => setSettings(cur => ({ ...cur, sidebarLayout: SidebarLayout.NORMAL }))}
              image={
                theme.type === 'light'
                  ? require('../assets/settings/layout-normal-light.png')
                  : require('../assets/settings/layout-normal-dark.png')
              }
              label={t('sidebarLayout.normal')}
            />
            <CardsSelectionButton
              isChecked={settings.sidebarLayout === 'compact'}
              onClick={() => setSettings(cur => ({ ...cur, sidebarLayout: SidebarLayout.COMPACT }))}
              image={
                theme.type === 'light'
                  ? require('../assets/settings/layout-compact-light.png')
                  : require('../assets/settings/layout-compact-dark.png')
              }
              label={t('sidebarLayout.compact')}
            />
            <CardsSelectionButton
              isChecked={settings.sidebarLayout === 'micro'}
              onClick={() => setSettings(cur => ({ ...cur, sidebarLayout: SidebarLayout.MICRO }))}
              image={
                theme.type === 'light'
                  ? require('../assets/settings/layout-micro-light.png')
                  : require('../assets/settings/layout-micro-dark.png')
              }
              label={t('sidebarLayout.micro')}
            />
          </View>
          <View style={styles.hr} />
          <Text style={styles.headline}>{t('weekDays.settingsTitle')}</Text>
          <WorkingDaysSetting />
          <View style={styles.hr} />
          <Toggle
            label={t('weekDays.hideNonWorkingDays')}
            state={settings.hideNonWorkingDays}
            setState={newState => setSettings(cur => ({ ...cur, hideNonWorkingDays: newState }))}
          />
        </View>
        <View style={styles.card}>
          <Text style={styles.headline}>Worklogs</Text>
          <Toggle
            label={t('worklogs.disableEditingOfPastWorklogs')}
            state={settings.disableEditingOfPastWorklogs}
            setState={newState => setSettings(cur => ({ ...cur, disableEditingOfPastWorklogs: newState }))}
          />
        </View>
        <View style={styles.card}>
          <Text style={styles.headline}>{t('account.settingsTitle')}</Text>
          <ButtonDanger label={t('account.logOut')} onPress={logout} />
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
