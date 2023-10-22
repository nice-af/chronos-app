import React, { useCallback, useEffect, useState } from 'react';
import { Alert, EmitterSubscription, Image, Linking, StyleSheet, Text, View } from 'react-native';
import { ButtonPrimary } from '../components/ButtonPrimary';
import { Layout } from '../components/Layout';
import { colors } from '../styles/colors';
import { typo } from '../styles/typo';
import { getPadding } from '../styles/utils';
import { useInitialURL } from '../services/deep-linking.service';

interface LoginProps {
  onLoginPress: () => void;
}

const YOUR_USER_BOUND_VALUE = 'test123';
const oAuthUrl = `https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=DBH6YrvUgT6iprVkMaqlS31IGzxBkLh1&scope=read%3Ajira-work&redirect_uri=http%3A%2F%2Flocalhost%3A3420&state=${YOUR_USER_BOUND_VALUE}&response_type=code&prompt=consent`;

export const Login: React.FC<LoginProps> = ({ onLoginPress }) => {
  const handlePress = useCallback(async () => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(oAuthUrl);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(oAuthUrl);
    } else {
      Alert.alert(`Don't know how to open this URL: ${oAuthUrl}`);
    }
  }, [oAuthUrl]);

  const { url: initialUrl, processing } = useInitialURL();

  useEffect(() => {
    const handleLink = (event: { url: string }) => {
      console.warn('handleLink', event.url);
    };

    Linking.addEventListener('url', handleLink);
  }, [initialUrl]);

  return (
    <Layout header={{ title: 'Login', showDayPicker: false }}>
      <View style={styles.container}>
        <Image style={styles.appIcon} source={require('../assets/app-icon.png')} />
        <Text style={styles.text}>Click the button below to login to your Jira account.</Text>
        <Text>processing: {processing ? 'true' : 'false'}</Text>
        <Text>initialUrl: {initialUrl}</Text>
        <ButtonPrimary label='Login to Jira' onPress={handlePress} />
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
