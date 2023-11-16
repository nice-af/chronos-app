import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Layout } from '../components/Layout';
import { LayoutSettings } from '../components/LayoutSetting';
import { WorkingDaysSetting } from '../components/WorkingDaysSetting';
import { GlobalContext } from '../contexts/global.context';
import { colors } from '../styles/colors';
import { typo } from '../styles/typo';
import { Toggle } from '../components/Toggle';

export const Settings: React.FC = () => {
  const {
    setCurrentScreen,
    disableEditingOfPastWorklogs,
    setDisableEditingOfPastWorklogs,
    hideNonWorkingDays,
    setHideNonWorkingDays,
  } = useContext(GlobalContext);

  return (
    <Layout header={{ layout: 'left', title: 'Settings', onBackPress: () => setCurrentScreen('login') }}>
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
