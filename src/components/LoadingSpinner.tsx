import React, { FC, useContext, useMemo, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, View } from 'react-native';
import { ThemeContext } from '../contexts/theme.context';
import { useThemedStyles } from '../services/theme.service';
import { Theme } from '../styles/theme/theme-types';

export const LoadingSpinner: FC = () => {
  const { theme } = useContext(ThemeContext);

  const rotateAnim = useRef(new Animated.Value(1)).current;

  Animated.timing(rotateAnim, {
    toValue: 4,
    duration: 1000,
    easing: Easing.step0,
    useNativeDriver: true,
  }).start();

  const { image, opacityInactive } = useMemo(() => {
    if (theme.type === 'light') {
      return { image: require('../assets/loading-spinner-element-light.png'), opacityInactive: 0.15 };
    } else {
      return { image: require('../assets/loading-spinner-element-dark.png'), opacityInactive: 0.12 };
    }
  }, [theme]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            {
              rotate: rotateAnim.interpolate({
                inputRange: [0, 4],
                outputRange: ['0deg', '360deg'],
              }),
            },
          ],
        },
      ]}>
      <Image width={14} height={14} style={styles.topRight} source={image} />
      <Image width={14} height={14} style={[styles.bottomRight, { opacity: opacityInactive }]} source={image} />
      <Image width={14} height={14} style={[styles.bottomLeft, { opacity: opacityInactive }]} source={image} />
      <Image width={14} height={14} style={[styles.topLeft, { opacity: opacityInactive }]} source={image} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: 30,
    height: 30,
  },
  topRight: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  bottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    transform: [{ rotate: '90deg' }],
  },
  bottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    transform: [{ rotate: '180deg' }],
  },
  topLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    transform: [{ rotate: '270deg' }],
  },
});
