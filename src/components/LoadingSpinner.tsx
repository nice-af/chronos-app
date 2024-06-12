import { useAtomValue } from 'jotai';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { Animated, ImageSourcePropType, StyleSheet, View, ViewStyle } from 'react-native';
import { themeAtom } from '../atoms';
import { LOADING_SPINNER_SPEED } from '../const';

interface LoadingSpinnerProps {
  style?: ViewStyle;
  forcedTheme?: 'light' | 'dark';
  size?: 'tiny' | 'small' | 'normal';
}

export const LoadingSpinner: FC<LoadingSpinnerProps> = ({ style, forcedTheme, size = 'normal' }) => {
  const theme = useAtomValue(themeAtom);
  const [activeElement, setActiveElement] = useState(0);

  const { image, imageSize, containerSize, opacityInactive } = useMemo(() => {
    let nImage: ImageSourcePropType;
    let nImageSize: number;
    let nContainerSize: number;
    let nOpacityInactive: number;
    if ((forcedTheme ?? theme.type) === 'light') {
      nOpacityInactive = 0.15;
      switch (size) {
        case 'tiny':
          nImage = require('../assets/loading-spinner/loading-spinner-tiny-element-light.png');
          break;
        case 'small':
          nImage = require('../assets/loading-spinner/loading-spinner-small-element-light.png');
          break;
        case 'normal':
          nImage = require('../assets/loading-spinner/loading-spinner-element-light.png');
          break;
      }
    } else {
      nOpacityInactive = 0.12;
      switch (size) {
        case 'tiny':
          nImage = require('../assets/loading-spinner/loading-spinner-tiny-element-dark.png');
          break;
        case 'small':
          nImage = require('../assets/loading-spinner/loading-spinner-small-element-dark.png');
          break;
        case 'normal':
          nImage = require('../assets/loading-spinner/loading-spinner-element-dark.png');
          break;
      }
    }

    switch (size) {
      case 'tiny':
        nImageSize = 6;
        nContainerSize = 14;
        break;
      case 'small':
        nImageSize = 10;
        nContainerSize = 22;
        break;
      case 'normal':
        nImageSize = 14;
        nContainerSize = 30;
        break;
    }
    return { image: nImage, imageSize: nImageSize, containerSize: nContainerSize, opacityInactive: nOpacityInactive };
  }, [theme]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveElement(prev => (prev + 1) % 4);
    }, LOADING_SPINNER_SPEED);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={[styles.container, { width: containerSize, height: containerSize }, style]}>
      <Animated.Image
        width={imageSize}
        height={imageSize}
        style={[styles.topRight, { opacity: activeElement === 0 ? 1 : opacityInactive }]}
        source={image}
      />
      <Animated.Image
        width={imageSize}
        height={imageSize}
        style={[styles.bottomRight, { opacity: activeElement === 1 ? 1 : opacityInactive }]}
        source={image}
      />
      <Animated.Image
        width={imageSize}
        height={imageSize}
        style={[styles.bottomLeft, { opacity: activeElement === 2 ? 1 : opacityInactive }]}
        source={image}
      />
      <Animated.Image
        width={imageSize}
        height={imageSize}
        style={[styles.topLeft, { opacity: activeElement === 3 ? 1 : opacityInactive }]}
        source={image}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
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
