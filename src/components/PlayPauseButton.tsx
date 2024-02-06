import transparentize from 'polished/lib/color/transparentize';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, PressableProps, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { ThemeContext } from '../contexts/theme.context';
import { formatUnixTimestampToHMM } from '../services/date.service';
import { useThemedStyles } from '../services/theme.service';
import { Theme } from '../styles/theme/theme-types';
import { typo } from '../styles/typo';
import { getPadding } from '../styles/utils';

interface PlayPauseButtonProps extends Omit<PressableProps, 'style'> {
  duration: number;
  isRunning?: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

export const PlayPauseButton: React.FC<PlayPauseButtonProps> = ({ onPress, duration, ...props }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const animBounce = useRef(new Animated.Value(0)).current;
  const styles = useThemedStyles(createStyles);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    Animated.timing(animBounce, {
      toValue: isRunning ? 1 : 0,
      duration: 350,
      useNativeDriver: true,
      easing: Easing.bezier(0.57, 1.66, 0.45, 0.915),
    }).start();
  }, [isRunning]);

  return (
    <View>
      <Pressable
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
        onPress={() => setIsRunning(!isRunning)}
        style={[styles.pressable, isHovered && styles.isHovered, props.style]}>
        <Animated.Image
          style={[
            styles.play,
            {
              transform: [
                {
                  rotate: animBounce.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '45deg'],
                  }),
                },
                {
                  scale: animBounce.interpolate({
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
                  rotate: animBounce.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['-45deg', '0deg'],
                  }),
                },
                {
                  scale: animBounce,
                },
              ],
            },
          ]}
          source={require('../assets/icons/pause-green.png')}
        />
        <Animated.View style={[styles.buttonFill, { transform: [{ scale: animBounce }] }]} />
      </Pressable>
      <Text style={[styles.duration, { color: isRunning ? theme.green : theme.textSecondary }]}>
        {formatUnixTimestampToHMM(duration)}
      </Text>
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
      borderRadius: 5,
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
      backgroundColor: transparentize(0.75, theme.green),
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
