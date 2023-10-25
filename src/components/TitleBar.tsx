import { useAppState } from '@react-native-community/hooks';
import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GlobalContext } from '../contexts/global.context';
import { colors } from '../styles/colors';
import { typo } from '../styles/typo';
import { getPadding } from '../styles/utils';

export const titleBarHeight = 28;

interface TitleBarProps {
  title: string;
}

export const TitleBar: React.FC<TitleBarProps> = ({ title }) => {
  const currentAppState = useAppState();
  const { selectedDate } = useContext(GlobalContext);

  const selectedDateString = selectedDate.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <View style={styles.container}>
      <Text style={[styles.today, currentAppState === 'inactive' && { opacity: 0.4 }]}>{selectedDateString}</Text>
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
    ...getPadding(5, 16),
  },
  today: {
    ...typo.bodyEmphasized,
    color: colors.textPrimary,
  },
});
