import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const inputStyles = StyleSheet.create({
  textInput: {
    marginTop: 8,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: colors.backgroundDark,
    borderColor: colors.surfaceBorder,
    color: colors.textSecondary,
  },
});
