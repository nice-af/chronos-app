import React, { FC } from 'react';
import { Platform, PlatformColor, Pressable, StyleSheet, Text, View } from 'react-native';
import { useThemedStyles } from '../services/theme.service';
import { Theme } from '../styles/theme/theme-types';
import { typo } from '../styles/typo';

export interface ToggleProps {
  state: boolean;
  setState: (newState: boolean) => void;
  label: string;
  infoText?: string;
}

export const Toggle: FC<ToggleProps> = ({ state, setState, label, infoText }) => {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.label}>{label}</Text>
        {infoText && <Text style={styles.infoText}>{infoText}</Text>}
      </View>
      <Pressable
        onPress={() => setState(!state)}
        style={[styles.toggleContainer, state ? styles.toggleContainerOn : styles.toggleContainerOff]}>
        <View style={[styles.knob, state ? styles.knobOn : styles.knobOff]} />
        <View style={[styles.borderHighlight, state && styles.borderHighlightOn]} />
      </Pressable>
    </View>
  );
};

function createStyles(theme: Theme) {
  // This needs to be assigned to `styles` for react-native/no-unused-styles to work
  const styles = StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'row',
      gap: 12,
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    textContainer: {
      flexBasis: 'auto',
      flexShrink: 1,
    },
    label: {
      ...typo.body,
      color: theme.textPrimary,
    },
    infoText: {
      ...typo.callout,
      color: theme.textSecondary,
      marginTop: 4,
    },
    toggleContainer: {
      flexShrink: 0,
      ...Platform.select({
        default: {
          width: 26,
          height: 15,
          borderRadius: 8,
        },
        windows: {
          width: 40,
          height: 20,
          borderRadius: 10,
        },
      }),
    },
    toggleContainerOff: {
      ...Platform.select({
        default: {
          backgroundColor: 'rgba(0,0,0,0.3)',
        },
        windows: {
          backgroundColor: PlatformColor('ControlAltFillColorSecondaryBrush'),
        },
      }),
    },
    toggleContainerOn: {
      backgroundColor: theme.blue,
    },
    borderHighlight: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      ...Platform.select({
        default: {
          borderRadius: 8,
          borderWidth: 0.5,
          borderColor: 'rgba(255,255,255,0.1)',
        },
        windows: {
          borderRadius: 10,
          borderWidth: 1,
          borderColor: PlatformColor('ControlStrongStrokeColorDefaultBrush'),
        },
      }),
    },
    borderHighlightOn: {
      ...Platform.select({
        windows: {
          borderColor: 'transparent',
        },
      }),
    },
    knob: {
      ...Platform.select({
        default: {
          top: 1,
          width: 13,
          height: 13,
        },
        windows: {
          top: 4,
          width: 12,
          height: 12,
        },
      }),
      backgroundColor: theme.white,
      borderRadius: 999,
    },
    knobOff: {
      ...Platform.select({
        default: {
          left: 1,
        },
        windows: {
          left: 4,
        },
      }),
    },
    knobOn: {
      ...Platform.select({
        default: {
          left: 12,
        },
        windows: {
          left: 24,
        },
      }),
    },
  });
  return styles;
}
