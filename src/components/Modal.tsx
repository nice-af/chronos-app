import React, { FC } from 'react';
import { Image, ImageSourcePropType, Platform, StyleSheet, Text, View } from 'react-native';
import { useThemedStyles } from '../services/theme.service';
import { Theme } from '../styles/theme/theme-types';
import { typo } from '../styles/typo';
import { getPadding } from '../styles/utils';
import { ButtonSecondary } from './ButtonSecondary';
import { ButtonPrimary } from './ButtonPrimary';
import { useAtomValue } from 'jotai';
import { themeAtom } from '../atoms';

interface ModalProps {
  headline: string;
  text: string;
  icon?: 'timer-warning';
}

const iconTimerWarningLight: ImageSourcePropType = require('../assets/modal-icons/timer-warning-light.png');
const iconTimerWarningDark: ImageSourcePropType = require('../assets/modal-icons/timer-warning-dark.png');

export const Modal: FC<ModalProps> = ({ headline, text, icon }) => {
  const styles = useThemedStyles(createStyles);
  const theme = useAtomValue(themeAtom);
  let iconSource: ImageSourcePropType | null = null;

  if (icon === 'timer-warning') {
    iconSource = theme.type === 'light' ? iconTimerWarningLight : iconTimerWarningDark;
  }

  return (
    <View style={styles.backdropContainer}>
      <View style={styles.contentContainer}>
        {Platform.OS !== 'windows' && <View style={styles.insetBorder} />}
        <View style={styles.content}>
          {iconSource && <Image style={styles.icon} source={iconSource} />}
          <Text style={styles.headline}>{headline}</Text>
          <Text style={styles.text}>{text}</Text>
          <View style={styles.buttonsContainer}>
            <ButtonSecondary label='Cancel' onPress={() => {}} style={{ flexBasis: 100, flexGrow: 1 }} />
            <ButtonPrimary label='Continue' onPress={() => {}} style={{ flexBasis: 100, flexGrow: 1 }} />
          </View>
        </View>
      </View>
    </View>
  );
};

function createStyles(theme: Theme) {
  return StyleSheet.create({
    backdropContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 998,
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.backdrop,
      borderRadius: theme.buttonBorderRadius,
      ...getPadding(8, 12),
    },
    contentContainer: {
      maxWidth: 330,
      backgroundColor: theme.background,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 36,
      },
      shadowOpacity: 0.7,
      shadowRadius: 100,
    },
    content: {
      ...getPadding(20, 20, 16, 20),
    },
    icon: {
      width: 48,
      height: 48,
      alignSelf: 'center',
      marginBottom: 20,
    },
    headline: {
      ...typo.bodyEmphasized,
      color: theme.textPrimary,
      marginBottom: 8,
      textAlign: 'center',
    },
    text: {
      ...typo.body,
      color: theme.textSecondary,
      textAlign: 'center',
    },
    insetBorder: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderWidth: 1,
      borderColor: theme.dayButtonBorderInset,
      borderRadius: 10,
    },
    buttonsContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 10,
      marginTop: 24,
    },
  });
}
