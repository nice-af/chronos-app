import { useAtomValue } from 'jotai';
import transparentize from 'polished/lib/color/transparentize';
import React, { FC, useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, PressableProps, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { settingsAtom, themeAtom } from '../atoms';
import { useThemedStyles } from '../services/theme.service';
import { formatSecondsToHMM } from '../services/time.service';
import { Theme } from '../styles/theme/theme-types';
import { typo } from '../styles/typo';
import { getPadding } from '../styles/utils';

interface PlayPauseButtonProps extends Omit<PressableProps, 'style'> {
  duration: number;
  isRunning?: boolean;
  onPress: () => void;
  style?: ViewStyle;
  isPrimaryWorklog?: boolean;
}

export const PlayPauseButton: FC<PlayPauseButtonProps> = ({
  onPress,
  isRunning,
  duration,
  isPrimaryWorklog,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [enableAnimation, setEnableAnimation] = useState(false);
  const animBounce = useRef(new Animated.Value(0)).current;
  const { workingTimeCountMethod } = useAtomValue(settingsAtom);
  const styles = useThemedStyles(createStyles);
  const theme = useAtomValue(themeAtom);

  useEffect(() => {
    Animated.timing(animBounce, {
      toValue: isRunning ? 1 : 0,
      duration: enableAnimation ? 350 : 0,
      useNativeDriver: true,
      easing: Easing.bezier(0.57, 1.66, 0.45, 0.915),
    }).start();
  }, [isRunning]);

  function outputRangeToStatic<T>([a, b]: [T, T]) {
    return isRunning ? b : a;
  }

  return (
    <View>
      <Pressable
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
        onPress={() => {
          setEnableAnimation(true);
          onPress();
        }}
        style={[styles.pressable, isHovered && styles.isHovered, props.style]}>
        <Animated.Image
          style={[
            styles.play,
            {
              transform: [
                {
                  rotate: !enableAnimation
                    ? outputRangeToStatic(['0deg', '45deg'])
                    : animBounce.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '45deg'],
                      }),
                },
                {
                  scale: !enableAnimation
                    ? outputRangeToStatic([1, 0])
                    : animBounce.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 0],
                      }),
                },
              ],
            },
          ]}
          source={
            theme.type === 'light'
              ? require('../assets/icons/play-light.png')
              : require('../assets/icons/play-dark.png')
          }
        />
        <Animated.Image
          style={[
            styles.pause,
            {
              transform: [
                {
                  rotate: !enableAnimation
                    ? outputRangeToStatic(['-45deg', '0deg'])
                    : animBounce.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['-45deg', '0deg'],
                      }),
                },
                {
                  scale: !enableAnimation ? outputRangeToStatic([0, 1]) : animBounce,
                },
              ],
            },
          ]}
          source={require('../assets/icons/pause-green.png')}
        />
        <Animated.View
          style={[
            styles.buttonFill,
            { transform: [{ scale: !enableAnimation ? outputRangeToStatic([0, 1]) : animBounce }] },
          ]}
        />
      </Pressable>
      <Text
        style={[
          styles.duration,
          workingTimeCountMethod === 'onlyPrimary' && !isPrimaryWorklog && { opacity: 0.5 },
          { color: isRunning ? theme.green : theme.textSecondary },
        ]}>
        {formatSecondsToHMM(duration)}
      </Text>
      {__DEV__ && <Text>({duration}s)</Text>}
    </View>
  );
};

function createStyles(theme: Theme) {
  return StyleSheet.create({
    pressable: {
      position: 'relative',
      alignSelf: 'center',
      width: 34,
      height: 34,
      borderRadius: 6,
      ...getPadding(9, 15),
      overflow: 'visible',
      margin: -3,
    },
    isHovered: {
      opacity: 0.8,
    },
    play: {
      position: 'absolute',
      top: 9,
      left: 9,
      width: 16,
      height: 16,
    },
    pause: {
      position: 'absolute',
      top: 9,
      left: 9,
      width: 16,
      height: 16,
    },
    buttonFill: {
      position: 'absolute',
      top: 1,
      left: 1,
      backgroundColor: transparentize(0.75, theme.green as string),
      width: 32,
      height: 32,
      borderRadius: 16,
    },
    duration: {
      ...typo.headline,
      marginTop: 6,
      textAlign: 'center',
    },
  });
}
