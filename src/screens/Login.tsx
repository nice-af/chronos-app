import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
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
    <Layout header={{ title: 'Login' }}>
      <View style={styles.container}>
        <Image style={styles.appIcon} source={require('../assets/app-icon.png')} />
        <Image style={styles.title} source={require('../assets/login-title-en.png')} />
        <Text style={styles.text}>
          Please click the button below to connect your Jira account with Jira Time Tracker.
        </Text>
        <ButtonPrimary label='Login to Jira' onPress={requestOAuth} />
        <Text>-</Text>
        <ButtonPrimary label='To next page' onPress={onLoginPress} />
      </View>
      <LinearGradient colors={['rgba(42,115,245,0.45)', 'rgba(42,115,245,0)']} style={styles.backgroundContainer}>
        <Text>Sign in with Facebook</Text>
      </LinearGradient>
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
  appIcon: {
    width: 90,
    height: 90,
  },
  title: {
    width: 183,
    height: 18,
    marginTop: 16,
  },
  text: {
    ...typo.body,
    maxWidth: 284,
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
    color: colors.textSecondary,
  },
  backgroundContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: 205,
  },
});
