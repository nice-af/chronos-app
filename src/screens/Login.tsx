import { useAtomValue } from 'jotai';
import React, { FC, useEffect, useState } from 'react';
import { Animated, Image, Platform, StyleSheet, Text, View } from 'react-native';
import { OAUTH_BASE_URL } from '@env';
import { loginsAtom, themeAtom } from '../atoms';
import { AnimateScreenContainer } from '../components/AnimateScreenContainer';
import { ButtonPrimary } from '../components/ButtonPrimary';
import { Layout } from '../components/Layout';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useAuthRequest } from '../services/jira-auth.service';
import { useTranslation } from '../services/i18n.service';
import { useThemedStyles } from '../services/theme.service';
import { Theme } from '../styles/theme/theme-types';
import { typo } from '../styles/typo';
import { getPadding } from '../styles/utils';
import { ErrorMessageToast } from '../components/ErrorMessageToast';

export const Login: FC = () => {
  const { initOAuth, isLoading: isLoadingOAuth } = useAuthRequest();
  const jiraAccounts = useAtomValue(loginsAtom);
  const theme = useAtomValue(themeAtom);
  const styles = useThemedStyles(createStyles);
  const { t } = useTranslation();
  const [showError, setShowError] = useState(false);
  const [animation] = useState(new Animated.Value(-100)); // Initial position off-screen

  async function pingServer() {
    try {
      const response = await fetch(`${OAUTH_BASE_URL}/api/status`);
      if (!response.ok) {
        throw new Error('Server is down');
      }
      setShowError(false);
    } catch (_error) {
      setShowError(true);
    }
  }

  // We ping the server every X seconds to check if it's reachable and show an error message if not.
  useEffect(() => {
    void pingServer();
    const interval = setInterval(pingServer, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    Animated.timing(animation, {
      toValue: showError ? 52 : -100,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [showError]);

  return (
    <AnimateScreenContainer isVisible={!jiraAccounts || jiraAccounts.length === 0} offScreenLocation='left'>
      <Layout
        customBackgroundColor={theme.backgroundLogin}
        header={Platform.OS !== 'windows' && { align: 'center', title: 'Login' }}>
        <Animated.View style={[styles.errorMessageToast, { top: animation }]}>
          <ErrorMessageToast message={t('login.noConnectionError')} />
        </Animated.View>
        <View style={styles.bgContainer}>
          <Image style={styles.bgGradient} source={require('../assets/login/bg-gradient.png')} />
          <Image style={styles.bgShine} source={require('../assets/login/bg-shine.png')} />
          <Image style={styles.shapeDice} source={require('../assets/login/shape-dice.png')} />
          <Image style={styles.shapePuck} source={require('../assets/login/shape-puck.png')} />
          <Image style={styles.shapeCone} source={require('../assets/login/shape-cone.png')} />
          <Image style={styles.shapeBallHalf} source={require('../assets/login/shape-ball-half.png')} />
        </View>
        <View style={styles.container}>
          <Image style={styles.appIcon} source={require('../assets/app-icon.png')} />
          <Image
            style={styles.title}
            source={
              theme.type === 'light'
                ? require('../assets/login/title-en-light.png')
                : require('../assets/login/title-en-dark.png')
            }
          />
          <Text style={styles.text}>{t('login.description')}</Text>
          <View style={styles.fixedHeightContainer}>
            {isLoadingOAuth && <LoadingSpinner />}
            {!isLoadingOAuth && <ButtonPrimary label={t('login.buttonLabel')} onPress={initOAuth} />}
          </View>
        </View>
      </Layout>
    </AnimateScreenContainer>
  );
};

function createStyles(theme: Theme) {
  // This needs to be assigned to `styles` for react-native/no-unused-styles to work
  const styles = StyleSheet.create({
    errorMessageToast: {
      position: 'absolute',
      top: -100,
      left: 0,
      width: '100%',
      zIndex: 3,
    },
    container: {
      display: 'flex',
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      zIndex: 2,
      ...getPadding(16, 16, 48, 16),
    },
    appIcon: {
      width: 90,
      height: 90,
    },
    title: {
      width: 188,
      height: 18,
      marginTop: 16,
      objectFit: 'contain',
    },
    text: {
      ...typo.body,
      maxWidth: 284,
      marginTop: 16,
      marginBottom: 24,
      textAlign: 'center',
      color: theme.textSecondary,
    },
    fixedHeightContainer: {
      height: 32,
    },
    bgContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      zIndex: 1,
      width: '100%',
      height: 228,
    },
    bgGradient: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      height: 205,
      objectFit: 'fill',
    },
    bgShine: {
      position: 'absolute',
      bottom: 0,
      left: '50%',
      width: 568,
      height: 228,
      marginLeft: -284,
    },
    shapeDice: {
      position: 'absolute',
      bottom: 110,
      left: '50%',
      width: 72,
      height: 72,
      marginLeft: -242,
    },
    shapePuck: {
      position: 'absolute',
      bottom: -11,
      left: '50%',
      width: 75,
      height: 55,
      marginLeft: -122,
    },
    shapeCone: {
      position: 'absolute',
      bottom: 25,
      left: '50%',
      width: 66,
      height: 69,
      marginLeft: 40,
    },
    shapeBallHalf: {
      position: 'absolute',
      bottom: 115,
      left: '50%',
      width: 75,
      height: 62,
      marginLeft: 181,
    },
  });
  return styles;
}
