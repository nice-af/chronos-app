import { Platform, StyleSheet } from 'react-native';
import { Theme } from './theme/theme-types';
import { typo } from './typo';

export function createSettingsStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      justifyContent: 'flex-start',
      padding: 16,
      gap: 16,
      ...Platform.select({
        windows: {
          paddingTop: 8,
        },
      }),
    },
    card: {
      position: 'relative',
      padding: 10,
      maxWidth: 420,
      backgroundColor: theme.surface,
      borderColor: theme.surfaceBorder,
      borderWidth: 1,
      borderRadius: 6,
    },
    headline: {
      ...typo.headline,
      color: theme.textPrimary,
      marginBottom: 12,
    },
    label: { ...typo.body, color: theme.textPrimary },
    note: { ...typo.callout, color: theme.textSecondary },
    hr: {
      width: '100%',
      height: 1,
      backgroundColor: theme.surfaceBorder,
      marginVertical: 12,
    },
  });
}
