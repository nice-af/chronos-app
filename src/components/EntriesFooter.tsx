import { useAtomValue, useSetAtom } from 'jotai';
import React, { FC, useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { activeWorklogAtom, syncWorklogsForCurrentDayAtom } from '../atoms';
import { formatDateToYYYYMMDD } from '../services/date.service';
import { useThemedStyles } from '../services/theme.service';
import { Theme } from '../styles/theme/theme-types';
import { ButtonPrimary } from './ButtonPrimary';
import { useTranslation } from '../services/i18n.service';
import { LoadingSpinnerSmall } from './LoadingSpinnerSmall';
import { LoadingBar } from './LoadingBar';
import { typo } from '../styles/typo';

interface EntriesFooterProps {
  dayHasChanges: boolean;
}

export const EntriesFooter: FC<EntriesFooterProps> = ({ dayHasChanges }) => {
  const syncWorklogsForCurrentDay = useSetAtom(syncWorklogsForCurrentDayAtom);
  const styles = useThemedStyles(createStyles);
  const [isSyncing, setIsSyncing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { t } = useTranslation();
  const containerPosition = useRef(new Animated.Value(0)).current; // 0 is not visible, 1 is visible
  const buttonVisibility = useRef(new Animated.Value(0)).current;
  const loadingVisibility = useRef(new Animated.Value(0)).current;
  const isVisible = dayHasChanges;

  async function startSync() {
    setIsSyncing(true);
    console.log('syncing...');
    [0, 0.25, 0.5, 0.75, 1].forEach((progress, i) => {
      setTimeout(() => {
        setProgress(progress);
      }, i * 1000);
    });

    setTimeout(() => setIsSyncing(false), 5500);
    // await syncWorklogsForCurrentDay();
    // setIsSyncing(false);
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
    <Animated.View style={[styles.container, { transform: [{ translateY: containerPosition }] }]}>
      <Animated.View style={[styles.buttonContainer, { opacity: buttonVisibility }]}>
        <ButtonPrimary label={isSyncing ? 'sync' : t('syncDay')} isDisabled={isSyncing} onPress={startSync} />
      </Animated.View>
      <Animated.View style={[styles.loadingContainer, { opacity: loadingVisibility }]}>
        <Text style={styles.loadingText}>{t('submittingWorklogs')}</Text>
        <LoadingBar progress={progress} />
      </Animated.View>
    </Animated.View>
  );
};

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderColor: theme.border,
      borderTopWidth: 1,
      height: 86,
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
}
