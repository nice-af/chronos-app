import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { getPadding } from '../styles/utils';
import { PlusButton } from './PlusButton';
import { PrimaryButton } from './PrimaryButton';

export const Footer: React.FC = () => {
  return (
    <>
      <View style={styles.container}>
        <PlusButton onPress={() => {}} />
        <PrimaryButton
          onPress={() => null}
          label='Submit timesheet'
          iconRight={<Image style={styles.paperplane} source={require('../assets/icon-paperplane.png')} />}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#545250',
    ...getPadding(8, 16),
  },
  paperplane: {
    width: 16,
    height: 16,
    margin: -1,
  },
});
