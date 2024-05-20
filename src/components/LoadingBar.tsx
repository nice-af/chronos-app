import React, { FC, useEffect, useRef, useState } from 'react';
import { Animated, Pressable, PressableProps, StyleSheet, Text, View, ViewProps } from 'react-native';
import { useThemedStyles } from '../services/theme.service';
import { Theme } from '../styles/theme/theme-types';
import { typo } from '../styles/typo';
import { getPadding } from '../styles/utils';
import { CustomButtonProps } from '../types/global.types';
import { LoadingSpinnerSmall } from './LoadingSpinnerSmall';
import { AnimatedCheckmarkIcon } from './AnimatedCheckmarkIcon';

type LoadingBarProps = ViewProps & {
  progress: number;
};

export const LoadingBar: FC<LoadingBarProps> = ({ progress, ...props }) => {
  const styles = useThemedStyles(createStyles);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const loadingSpinnerAnim = useRef(new Animated.Value(1)).current;
  const [showCheckmark, setShowCheckmark] = useState(false);

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
        useNativeDriver: true,
      }).start();
      setTimeout(() => setShowCheckmark(progress === 1), 100);
    }
  }, [progress]);

  return (
    <View style={styles.container}>
      <View style={styles.spinnerBg} />
      {showCheckmark && <AnimatedCheckmarkIcon style={styles.checkmark} />}
      <Animated.View style={[styles.spinnerContainer, { opacity: loadingSpinnerAnim }]}>
        <LoadingSpinnerSmall />
      </Animated.View>
      <View {...props} style={[styles.barContainer, props.style]}>
        <Animated.View style={[styles.progress, { transform: [{ scaleX: progressAnim }] }]} />
      </View>
    </View>
  );
};

function createStyles(theme: Theme) {
  return StyleSheet.create({
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
}
