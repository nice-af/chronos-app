import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { getPadding } from '../styles/utils';
import BackgroundView from './BackgroundView.macos';
import { PlusButton } from './PlusButton';
import { PrimaryButton } from './PrimaryButton';

export const footerHeight = 44;

export const Footer: React.FC = () => {
  return (
    <>
      <View style={styles.container}>
        <BackgroundView blendingMode={1} material={3} style={styles.backgroundView} />
        <View style={styles.wrapper}>
          <PlusButton onPress={() => {}} />
          <PrimaryButton
            onPress={() => null}
            label='Submit timesheet'
            iconRight={<Image style={styles.paperplane} source={require('../assets/icon-paperplane.png')} />}
          />
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
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: -1 },
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...getPadding(8, 16),
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
});
