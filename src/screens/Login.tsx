import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { ButtonPrimary } from '../components/ButtonPrimary';
import { Layout } from '../components/Layout';
import { useAuthRequest } from '../services/auth.service';
import { colors } from '../styles/colors';
import { typo } from '../styles/typo';
import { getPadding } from '../styles/utils';

interface LoginProps {
  onLoginPress: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginPress }) => {
  const { requestOAuth, isLoading } = useAuthRequest();

  return (
    <Layout header={{ title: 'Login', showDayPicker: false }}>
      <View style={styles.container}>
        <Image style={styles.appIcon} source={require('../assets/app-icon.png')} />
        <Text style={styles.text}>Click the button below to login to your Jira account.</Text>
        <Text>isLoading: {isLoading ? 'true' : 'false'}</Text>
        <ButtonPrimary label='Login to Jira' onPress={requestOAuth} />
        <Text>-</Text>
        <ButtonPrimary label='To next page' onPress={onLoginPress} />
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    height: '100%',
    ...getPadding(12, 16),
  },
  text: {
    ...typo.body,
    maxWidth: 196,
    marginTop: 8,
    marginBottom: 16,
    textAlign: 'center',
    color: colors.textPrimary,
  },
  appIcon: {
    width: 72,
    height: 72,
  },
});
