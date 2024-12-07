import React, { FC, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View, ViewProps } from 'react-native';
import { useThemedStyles } from '../services/theme.service';
import { Theme } from '../styles/theme/theme-types';
import { AnimatedCheckmarkIcon } from './AnimatedCheckmarkIcon';
import { LoadingSpinner } from './LoadingSpinner';
import { SyncProgressAtom } from '../atoms/progress';

type LoadingBarProps = ViewProps & {
  progressAtom: SyncProgressAtom;
};

export const LoadingBar: FC<LoadingBarProps> = ({ progressAtom, ...props }) => {
  const styles = useThemedStyles(createStyles);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const loadingSpinnerAnim = useRef(new Animated.Value(1)).current;
  const [showCheckmark, setShowCheckmark] = useState(false);
  const progress = progressAtom ? (progressAtom?.progress / progressAtom?.total ?? 1) : 0;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 100,
      useNativeDriver: true,
    }).start();

    if (progress === 1 || progress === 0) {
      Animated.timing(loadingSpinnerAnim, {
        toValue: progress === 1 ? 0 : 1,
        duration: 100,
        delay: progress === 0 ? 100 : 0,
        useNativeDriver: true,
      }).start();
      setTimeout(() => setShowCheckmark(progress === 1), 300);
    }
  }, [progress]);

  return (
    <View style={styles.container}>
      <View style={styles.spinnerBg} />
      {showCheckmark && <AnimatedCheckmarkIcon style={styles.checkmark} />}
      <Animated.View style={[styles.spinnerContainer, { opacity: loadingSpinnerAnim }]}>
        <LoadingSpinner size='small' />
      </Animated.View>
      <View {...props} style={[styles.barContainer, props.style]}>
        <Animated.View style={[styles.progress, { transform: [{ scaleX: progressAnim }] }]} />
      </View>
    </View>
  );
};

function createStyles(theme: Theme) {
  // This needs to be assigned to `styles` for react-native/no-unused-styles to work
  const styles = StyleSheet.create({
    container: {
      position: 'relative',
      width: '100%',
      height: 22,
    },
    barContainer: {
      position: 'absolute',
      zIndex: 1,
      top: 8,
      left: 0,
      width: '100%',
      height: 6,
      borderRadius: 3,
      overflow: 'hidden',
      backgroundColor: theme.backgroundDark,
    },
    progress: {
      width: '100%',
      height: '100%',
      transformOrigin: 'left',
      backgroundColor: theme.textPrimary,
    },
    spinnerContainer: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      margin: -11,
      zIndex: 3,
    },
    checkmark: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -6.5,
      marginRight: -3,
      marginBottom: -6.5,
      marginLeft: -3,
      zIndex: 3,
    },
    spinnerBg: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      zIndex: 2,
      width: 24,
      height: 24,
      margin: -12,
      backgroundColor: theme.background,
      transform: [{ rotate: '45deg' }],
    },
  });
  return styles;
}
