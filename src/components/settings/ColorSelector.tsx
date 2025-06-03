import { useAtomValue } from 'jotai';
import React, { FC, useMemo, useState } from 'react';
import {
  Image,
  ImageSourcePropType,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { themeAtom } from '../../atoms';
import { useThemedStyles } from '../../services/theme.service';
import { ColorOption, Theme, colorKeys } from '../../styles/theme/theme-types';

interface ColorSelectorProps {
  selectedColor: ColorOption;
  setSelectedColor: (color: ColorOption) => void;
}

export const ColorSelector: FC<ColorSelectorProps> = ({ selectedColor, setSelectedColor }) => {
  const styles = useThemedStyles(createStyles);
  const theme = useAtomValue(themeAtom);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(true);

  const customColorSrc = useMemo<ImageSourcePropType>(
    () => require('../../assets/color-picker-custom.png') as ImageSourcePropType,
    []
  );

  const fadeImages = useMemo(() => {
    const currentTheme = theme.type as 'light' | 'dark';
    return {
      left:
        currentTheme === 'light'
          ? require('../../assets/color-selector/color-selector-gradient-left-light.png')
          : require('../../assets/color-selector/color-selector-gradient-left-dark.png'),
      right:
        currentTheme === 'light'
          ? require('../../assets/color-selector/color-selector-gradient-right-light.png')
          : require('../../assets/color-selector/color-selector-gradient-right-dark.png'),
    };
  }, [theme.type]);

  function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const scrollX = contentOffset.x;
    const contentWidth = contentSize.width;
    const containerWidth = layoutMeasurement.width;

    // Show left fade if scrolled away from the start
    setShowLeftFade(scrollX > 5);

    // Show right fade if not scrolled to the end
    setShowRightFade(scrollX < contentWidth - containerWidth - 5);
  }

  return (
    <View style={styles.wrapper}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsHorizontalScrollIndicator={false}
        horizontal
        onScroll={handleScroll}
        scrollEventThrottle={16}>
        {colorKeys.map(colorKey => (
          <Pressable
            key={colorKey}
            onPress={() => setSelectedColor(colorKey)}
            style={[styles.colorOption, { backgroundColor: theme[colorKey] }]}>
            {selectedColor === colorKey && <View style={styles.activeIndicator} />}
          </Pressable>
        ))}
        <Pressable onPress={() => setSelectedColor('custom')} style={styles.colorOption}>
          {selectedColor === 'custom' && <View style={styles.activeIndicator} />}
          <Image style={styles.customColor} source={customColorSrc} />
        </Pressable>
      </ScrollView>

      {/* Left fade overlay */}
      {showLeftFade && (
        <View style={[styles.fadeOverlay, styles.leftFade]} pointerEvents='none'>
          <Image source={fadeImages.left} style={styles.fadeImage} />
        </View>
      )}

      {/* Right fade overlay */}
      {showRightFade && (
        <View style={[styles.fadeOverlay, styles.rightFade]} pointerEvents='none'>
          <Image source={fadeImages.right} style={styles.fadeImage} />
        </View>
      )}
    </View>
  );
};

function createStyles(theme: Theme) {
  // This needs to be assigned to `styles` for react-native/no-unused-styles to work
  const styles = StyleSheet.create({
    wrapper: {
      position: 'relative',
    },
    container: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 9,
      padding: 4,
    },
    colorOption: {
      position: 'relative',
      width: 18,
      height: 18,
      borderRadius: 9,
    },
    activeIndicator: {
      position: 'absolute',
      width: 26,
      height: 26,
      top: -4,
      left: -4,
      borderRadius: 13,
      borderWidth: 2,
      borderColor: theme.blue,
      pointerEvents: 'none',
    },
    customColor: {
      width: 18,
      height: 18,
      borderRadius: 9,
    },
    fadeOverlay: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      width: 20,
    },
    fadeImage: {
      width: 32,
      height: '100%',
      resizeMode: 'stretch',
    },
    leftFade: {
      left: 0,
    },
    rightFade: {
      right: 0,
    },
  });
  return styles;
}
