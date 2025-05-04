import { useAtomValue } from 'jotai';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { Image, StyleSheet, View, ViewStyle } from 'react-native';
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

  const spinnerThemes = {
    light: {
      opacityInactive: 0.15,
      image: {
        tiny: require('../assets/loading-spinner/loading-spinner-tiny-element-light.png'),
        small: require('../assets/loading-spinner/loading-spinner-small-element-light.png'),
        normal: require('../assets/loading-spinner/loading-spinner-element-light.png'),
      },
    },
    dark: {
      opacityInactive: 0.12,
      image: {
        tiny: require('../assets/loading-spinner/loading-spinner-tiny-element-dark.png'),
        small: require('../assets/loading-spinner/loading-spinner-small-element-dark.png'),
        normal: require('../assets/loading-spinner/loading-spinner-element-dark.png'),
      },
    },
  };

  const loadingSpinnerSizes = {
    tiny: {
      imageSize: 6,
      containerSize: 14,
    },
    small: {
      imageSize: 10,
      containerSize: 22,
    },
    normal: {
      imageSize: 14,
      containerSize: 30,
    },
  };

  const { image, imageSize, containerSize, opacityInactive } = useMemo(() => {
    const currentTheme = (forcedTheme ?? theme.type) as 'light' | 'dark';
    const spinnerTheme = spinnerThemes[currentTheme];
    const sizeConfig = loadingSpinnerSizes[size];
    return {
      image: spinnerTheme.image[size],
      imageSize: sizeConfig.imageSize,
      containerSize: sizeConfig.containerSize,
      opacityInactive: spinnerTheme.opacityInactive,
    };
  }, [forcedTheme, theme.type, size]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveElement(prev => (prev + 1) % 4);
    }, LOADING_SPINNER_SPEED);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={[styles.container, { width: containerSize, height: containerSize }, style]}>
      <Image
        width={imageSize}
        height={imageSize}
        style={[styles.topRight, { opacity: activeElement === 0 ? 1 : opacityInactive }]}
        source={image}
      />
      <Image
        width={imageSize}
        height={imageSize}
        style={[styles.bottomRight, { opacity: activeElement === 1 ? 1 : opacityInactive }]}
        source={image}
      />
      <Image
        width={imageSize}
        height={imageSize}
        style={[styles.bottomLeft, { opacity: activeElement === 2 ? 1 : opacityInactive }]}
        source={image}
      />
      <Image
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
