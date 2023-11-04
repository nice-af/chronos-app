import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '../styles/colors';
import { typo } from '../styles/typo';
import { ButtonTransparent } from './ButtonTransparent';

export const WeekPicker: React.FC = () => {
  return (
    <View style={styles.container}>
      <ButtonTransparent onPress={() => {}} hasLargePadding>
        <Image style={styles.arrow} source={require('../assets/icon-chevron-left.png')} />
      </ButtonTransparent>
      <View>
        <Text style={styles.label}>KW</Text>
        <Text style={styles.value}>41</Text>
      </View>
      <ButtonTransparent onPress={() => {}} hasLargePadding>
        <Image style={styles.arrow} source={require('../assets/icon-chevron-right.png')} />
      </ButtonTransparent>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 8,
  },
  arrow: {
    width: 7,
    height: 12,
  },
  label: {
    ...typo.subheadline,
    color: colors.textSecondary,
  },
  value: {
    ...typo.headline,
    color: colors.textPrimary,
  },
});
