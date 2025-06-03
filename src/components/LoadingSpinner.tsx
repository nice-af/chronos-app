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
      image: {
        tiny: require('../assets/loading-spinner/loading-spinner-tiny-light.png'),
        small: require('../assets/loading-spinner/loading-spinner-small-light.png'),
        normal: require('../assets/loading-spinner/loading-spinner-large-light.png'),
      },
    },
    dark: {
      image: {
        tiny: require('../assets/loading-spinner/loading-spinner-tiny-dark.png'),
        small: require('../assets/loading-spinner/loading-spinner-small-dark.png'),
        normal: require('../assets/loading-spinner/loading-spinner-large-dark.png'),
      },
    },
  };

  const loadingSpinnerSizes = {
    tiny: 14,
    small: 22,
    normal: 30,
  };

  const { image, spinnerSize } = useMemo(() => {
    const currentTheme = (forcedTheme ?? theme.type) as 'light' | 'dark';
    const spinnerTheme = spinnerThemes[currentTheme];
    return {
      image: spinnerTheme.image[size],
      spinnerSize: loadingSpinnerSizes[size],
    };
  }, [forcedTheme, theme.type, size]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveElement(prev => (prev + 1) % 4);
    }, LOADING_SPINNER_SPEED);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={[styles.container, { width: spinnerSize, height: spinnerSize }, style]}>
      <Image
        source={image}
        style={[
          styles.spritesheet,
          {
            width: spinnerSize * 4, // Spritesheet is 4 times wider
            height: spinnerSize,
            transform: [{ translateX: -activeElement * spinnerSize }], // Move to show current frame
          },
        ]}
        resizeMode='contain'
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden', // Hide the parts of the spritesheet we don't want to show
  },
  spritesheet: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
