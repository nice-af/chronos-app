import React, { useContext } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { ButtonPrimary } from '../components/ButtonPrimary';
import { Layout } from '../components/Layout';
import { GlobalContext } from '../contexts/global.context';
import { useAuthRequest } from '../services/auth.service';
import { userInfoFakeData, worklogsFakeData } from '../services/fake-data.service';
import { colors } from '../styles/colors';
import { typo } from '../styles/typo';
import { getPadding } from '../styles/utils';

export const Login: React.FC = () => {
  const { initOAuth, isLoading: isLoadingOAuth } = useAuthRequest();
  const { setWorklogs, setUserInfo } = useContext(GlobalContext);

  return (
    <Layout header={{ align: 'center', title: 'Login' }}>
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
        <Image style={styles.title} source={require('../assets/login/title-en.png')} />
        <Text style={styles.text}>
          Please click the button below to connect your Jira account with Jira Time Tracker.
        </Text>
        {/* TODO @AdrianFahrbach make loading state pretty (on button?) */}
        {isLoadingOAuth && <Text>Logging in...</Text>}
        <ButtonPrimary label='Login to Jira' onPress={initOAuth} />
        {__DEV__ && (
          <>
            <Text>-</Text>
            <ButtonPrimary
              label='To next page'
              onPress={() => {
                // TODO set fake user info data
                setWorklogs(worklogsFakeData);
                setUserInfo(userInfoFakeData);
              }}
            />
          </>
        )}
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
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
