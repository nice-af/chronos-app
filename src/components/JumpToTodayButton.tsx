import React from 'react';
import { Image, StyleSheet, Text } from 'react-native';
import { ButtonTransparent } from './ButtonTransparent';

export const JumpToTodayButton: React.FC = () => {
  const now = new Date();
  return (
    <ButtonTransparent onPress={() => {}}>
      <Text style={styles.day}>{now.getDate()}</Text>
      <Image style={styles.icon} source={require('../assets/icon-calendar-blank.png')} />
    </ButtonTransparent>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
  },
  day: {
    position: 'absolute',
    top: 11,
    left: 0,
    width: 28,
    textAlign: 'center',
    fontSize: 9,
    lineHeight: 9,
  },
});
