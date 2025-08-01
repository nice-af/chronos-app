import React, { FC } from 'react';
import { Image, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useThemedStyles } from '../services/theme.service';
import { Theme } from '../styles/theme/theme-types';
import { typo } from '../styles/typo';

interface EntriesFooterProps {
  message: string;
  style?: StyleProp<ViewStyle>;
}

export const ErrorMessageToast: FC<EntriesFooterProps> = ({ message, style }) => {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={[styles.container, style]}>
      <Image style={styles.icon} source={require('../assets/icons/error.png')} />
      <Text style={styles.errorText}>{message}</Text>
    </View>
  );
};

function createStyles(theme: Theme) {
  // This needs to be assigned to `styles` for react-native/no-unused-styles to work
  const styles = StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      gap: 16,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderColor: theme.border,
      backgroundColor: theme.red,
    },
    icon: {
      width: 20,
      height: 20,
    },
    errorText: {
      ...typo.body,
      lineHeight: 15,
      color: theme.black,
      flexGrow: 1,
      opacity: 0.55,
    },
  });
  return styles;
}
