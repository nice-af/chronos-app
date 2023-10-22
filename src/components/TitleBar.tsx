import { useAppState } from '@react-native-community/hooks';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../styles/colors';
import { typo } from '../styles/typo';
import { getPadding } from '../styles/utils';

export const titleBarHeight = 28;

export const TitleBar: React.FC = () => {
  const currentAppState = useAppState();
  return (
    <View style={styles.container}>
      <Text style={[styles.today, currentAppState === 'inactive' && { opacity: 0.4 }]}>Today, 21 Oct</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: titleBarHeight,
    ...getPadding(6, 16),
  },
  today: {
    ...typo.bodyEmphasized,
    color: colors.textPrimary,
  },
});
