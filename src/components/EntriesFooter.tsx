import { useAtomValue } from 'jotai';
import React, { FC, useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text } from 'react-native';
import { syncWorklogsForCurrentDay } from '../atoms';
import { useTranslation } from '../services/i18n.service';
import { useThemedStyles } from '../services/theme.service';
import { Theme } from '../styles/theme/theme-types';
import { typo } from '../styles/typo';
import { ButtonPrimary } from './ButtonPrimary';
import { LoadingBar } from './LoadingBar';
import { syncProgressAtom } from '../atoms/progress';

interface EntriesFooterProps {
  dayHasChanges: boolean;
}

export const EntriesFooter: FC<EntriesFooterProps> = ({ dayHasChanges }) => {
  const styles = useThemedStyles(createStyles);
  const progressAtomValue = useAtomValue(syncProgressAtom);
  const isSyncing = progressAtomValue !== null;
  const { t } = useTranslation();
  const isVisible = dayHasChanges;
  const containerPosition = useRef(new Animated.Value(isSyncing ? 0 : isVisible ? 28 : 88)).current; // 0 is not visible, 1 is visible
  const buttonVisibility = useRef(new Animated.Value(0)).current;
  const loadingVisibility = useRef(new Animated.Value(0)).current;

  async function startSync() {
    await syncWorklogsForCurrentDay();
  }

  useEffect(() => {
    Animated.timing(containerPosition, {
      toValue: isSyncing ? 0 : isVisible ? 28 : 88,
      duration: 250,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.quad),
    }).start();

    Animated.timing(buttonVisibility, {
      toValue: isSyncing ? 0 : 1,
      duration: 250,
      delay: isSyncing ? 0 : 250,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.quad),
    }).start();

    Animated.timing(loadingVisibility, {
      toValue: isSyncing ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.quad),
    }).start();
  }, [isVisible, isSyncing]);

  return (
    <Animated.View
      style={[
        styles.container,
        { pointerEvents: isVisible ? undefined : 'none', transform: [{ translateY: containerPosition }] },
      ]}>
      <Animated.View style={[styles.buttonContainer, { opacity: buttonVisibility }]}>
        <ButtonPrimary label={isSyncing ? 'sync' : t('syncDay')} isDisabled={isSyncing} onPress={startSync} />
      </Animated.View>
      <Animated.View style={[styles.loadingContainer, { opacity: loadingVisibility }]}>
        <Text style={styles.loadingText}>{t('submittingWorklogs')}</Text>
        <LoadingBar progressAtom={progressAtomValue} />
      </Animated.View>
    </Animated.View>
  );
};

function createStyles(theme: Theme) {
  // This needs to be assigned to `styles` for react-native/no-unused-styles to work
  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      height: 86,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderColor: theme.border,
      borderTopWidth: 1,
      backgroundColor: theme.background,
    },
    buttonContainer: {
      position: 'absolute',
      width: '100%',
      left: 16,
      bottom: 12,
      zIndex: 4,
      transform: [{ translateY: -28 }],
    },
    loadingContainer: {
      display: 'flex',
      alignItems: 'stretch',
      justifyContent: 'center',
      gap: 12,
    },
    loadingText: {
      ...typo.bodyEmphasized,
      color: theme.textPrimary,
      marginTop: 4,
      textAlign: 'center',
    },
  });
  return styles;
}
