import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Layout } from '../components/Layout';
import { colors } from '../styles/colors';
import { GlobalContext } from '../contexts/global.context';
import { getPadding } from '../styles/utils';
import { typo } from '../styles/typo';
import { LayoutSettings } from '../components/LayoutSettings';

export const Settings: React.FC = () => {
  const { setCurrentScreen } = useContext(GlobalContext);

  return (
    <Layout header={{ layout: 'left', title: 'Settings', onBackPress: () => setCurrentScreen('login') }}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.headline}>Sidebar layout</Text>
          <LayoutSettings />
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
    marginBottom: 4,
  },
});
