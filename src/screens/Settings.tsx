import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Layout } from '../components/Layout';
import { LayoutSettings } from '../components/LayoutSetting';
import { Toggle } from '../components/Toggle';
import { WorkingDaysSetting } from '../components/WorkingDaysSetting';
import { GlobalContext } from '../contexts/global.context';
import { NavigationContext } from '../contexts/navigation.context';
import { colors } from '../styles/colors';
import { typo } from '../styles/typo';
import { ButtonDanger } from '../components/ButtonDanger';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageKey } from '../const';
import { removeJiraClient } from '../services/jira.service';

export const Settings: React.FC = () => {
  const {
    disableEditingOfPastWorklogs,
    setDisableEditingOfPastWorklogs,
    hideNonWorkingDays,
    setHideNonWorkingDays,
    setApiSettings,
    setUserInfo,
  } = useContext(GlobalContext);
  const { setShowSettingsScreen, setCurrentWorklogToEdit, setShowSearchScreen } = useContext(NavigationContext);

  function logout() {
    setShowSettingsScreen(false);
    setShowSearchScreen(false);
    setCurrentWorklogToEdit(null);
    AsyncStorage.removeItem(StorageKey.API_SETTINGS);
    AsyncStorage.removeItem(StorageKey.USER_INFO);
    setApiSettings(null);
    setUserInfo(null);
    removeJiraClient();
  }

  return (
    <Layout header={{ align: 'left', title: 'Settings', onBackPress: () => setShowSettingsScreen(false) }}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.headline}>Sidebar layout</Text>
          <LayoutSettings />
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

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    padding: 16,
    gap: 16,
  },
  card: {
    padding: 10,
    backgroundColor: colors.surface,
    borderColor: colors.surfaceBorder,
    borderWidth: 1,
    borderRadius: 5,
  },
  headline: {
    ...typo.headline,
    marginBottom: 12,
  },
  hr: {
    width: '100%',
    height: 1,
    backgroundColor: colors.surfaceBorder,
    marginVertical: 12,
  },
});
