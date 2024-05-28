import { useAtomValue } from 'jotai';
import React, { FC, useEffect, useRef } from 'react';
import { Animated, Easing, Image, ImageSourcePropType, Platform, StyleSheet, Text, View } from 'react-native';
import { themeAtom } from '../atoms';
import { modalDataAtom, modalVisibleAtom } from '../atoms/modal';
import { useTranslation } from '../services/i18n.service';
import { useThemedStyles } from '../services/theme.service';
import { Theme } from '../styles/theme/theme-types';
import { typo } from '../styles/typo';
import { getPadding } from '../styles/utils';
import { ButtonPrimary } from './ButtonPrimary';
import { ButtonSecondary } from './ButtonSecondary';

export const Modal: FC = () => {
  const data = useAtomValue(modalDataAtom);
  const isVisible = useAtomValue(modalVisibleAtom);
  const styles = useThemedStyles(createStyles);
  const theme = useAtomValue(themeAtom);
  const { t } = useTranslation();
  const animBackground = useRef(new Animated.Value(0)).current;
  const animJump = useRef(new Animated.Value(0)).current;
  let iconSource: ImageSourcePropType | null = null;

  useEffect(() => {
    Animated.timing(animBackground, {
      toValue: isVisible ? 1 : 0,
      duration: 150,
      useNativeDriver: true,
      easing: Easing.ease,
    }).start();
    Animated.timing(animJump, {
      toValue: isVisible ? 1 : 0,
      duration: 150,
      useNativeDriver: true,
      easing: Easing.bezier(0.57, 1.66, 0.45, 0.915),
    }).start();
  }, [isVisible]);

  if (!data) {
    return null;
  }

  if (data.icon === 'timer-warning') {
    iconSource =
      theme.type === 'light'
        ? require('../assets/modal-icons/timer-warning-light.png')
        : require('../assets/modal-icons/timer-warning-dark.png');
  } else if (data.icon === 'account-warning') {
    iconSource =
      theme.type === 'light'
        ? require('../assets/modal-icons/account-warning-light.png')
        : require('../assets/modal-icons/account-warning-dark.png');
  } else if (data.icon === 'recover-worklogs') {
    iconSource =
      theme.type === 'light'
        ? require('../assets/modal-icons/recover-worklogs-light.png')
        : require('../assets/modal-icons/recover-worklogs-dark.png');
  }

  return (
    <View style={[styles.container, { pointerEvents: isVisible ? undefined : 'none' }]}>
      <Animated.View
        style={[
          styles.backdropContainer,
          {
            opacity: animBackground.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
            }),
          },
        ]}
      />
      <Animated.View
        style={[
          styles.contentContainer,
          {
            opacity: animBackground.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
            }),
            transform: [
              {
                scale: animJump.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1],
                }),
              },
            ],
          },
        ]}>
        {Platform.OS !== 'windows' && <View style={styles.insetBorder} />}
        <View style={styles.content}>
          {iconSource && <Image style={styles.icon} source={iconSource} />}
          <Text style={styles.headline}>{data.headline}</Text>
          <Text style={styles.text}>{data.text}</Text>
          <View style={styles.buttonsContainer}>
            <ButtonSecondary
              label={data.cancelButtonLabel ?? t('modals.cancel')}
              onPress={data.onCancel}
              style={{ flexBasis: 100, flexGrow: 1, paddingLeft: 10, paddingRight: 10 }}
            />
            <ButtonPrimary
              label={data.confirmButtonLabel ?? t('modals.continue')}
              onPress={data.onConfirm}
              style={{ flexBasis: 100, flexGrow: 1, paddingLeft: 10, paddingRight: 10 }}
            />
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 997,
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    backdropContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 997,
      width: '100%',
      height: '100%',
      backgroundColor: theme.backdrop,
    },
    contentContainer: {
      width: '100%',
      maxWidth: 330,
      zIndex: 998,
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
