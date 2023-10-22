import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { getPadding } from '../styles/utils';
import BackgroundView from './BackgroundView.macos';
import { FooterButton } from './FooterButton';
import { ButtonPrimary } from './ButtonPrimary';
import { ButtonSecondary } from './ButtonSecondary';

export const footerHeight = 44;

export const Footer: React.FC = () => {
  return (
    <>
      <View style={styles.container}>
        <BackgroundView blendingMode={1} material={3} style={styles.backgroundView} />
        <View style={styles.wrapper}>
          <FooterButton onPress={() => {}}>
            <Image style={styles.icon} source={require('../assets/icon-plus.png')} />
          </FooterButton>
          <ButtonSecondary
            onPress={() => null}
            label='Submit timesheet'
            iconRight={<Image style={styles.paperplane} source={require('../assets/icon-paperplane.png')} />}
          />
          <FooterButton onPress={() => {}}>
            <Image style={styles.icon} source={require('../assets/icon-calendar-jump.png')} />
          </FooterButton>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    minHeight: footerHeight,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: -1 },
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...getPadding(8, 12),
  },
  backgroundView: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  paperplane: {
    width: 16,
    height: 16,
    margin: -1,
  },
  icon: {
    width: 16,
    height: 16,
  },
});
