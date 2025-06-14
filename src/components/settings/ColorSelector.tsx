import { useAtomValue } from 'jotai';
import React, { FC, useMemo } from 'react';
import { Image, ImageSourcePropType, Pressable, StyleSheet, View } from 'react-native';
import { themeAtom } from '../../atoms';
import { useThemedStyles } from '../../services/theme.service';
import { ColorOption, Theme, colorKeys } from '../../styles/theme/theme-types';
import { HorizontalScrollWithFade } from '../HorizontalScrollWithFade';

interface ColorSelectorProps {
  selectedColor: ColorOption;
  setSelectedColor: (color: ColorOption) => void;
}

export const ColorSelector: FC<ColorSelectorProps> = ({ selectedColor, setSelectedColor }) => {
  const styles = useThemedStyles(createStyles);
  const theme = useAtomValue(themeAtom);
  const customColorSrc = useMemo<ImageSourcePropType>(
    () => require('../../assets/color-picker-custom.png') as ImageSourcePropType,
    []
  );

  return (
    <HorizontalScrollWithFade style={styles.wrapper} contentContainerStyle={styles.container}>
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
    </HorizontalScrollWithFade>
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
  });
  return styles;
}
