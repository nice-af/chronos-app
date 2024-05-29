import { useAtomValue } from 'jotai';
import React, { FC, useMemo } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { themeAtom } from '../../atoms';
import { useThemedStyles } from '../../services/theme.service';
import { Theme, colorKeys } from '../../styles/theme/theme-types';

export type ColorOption = (typeof colorKeys)[number] | 'custom';

interface ColorSelectorProps {
  selectedColor: ColorOption;
  setSelectedColor: (color: ColorOption) => void;
}

export const ColorSelector: FC<ColorSelectorProps> = ({ selectedColor, setSelectedColor }) => {
  const styles = useThemedStyles(createStyles);
  const theme = useAtomValue(themeAtom);
  const customColorSrc = useMemo(() => require('../../assets/color-picker-custom.png'), []);

  return (
    <ScrollView contentContainerStyle={styles.container} showsHorizontalScrollIndicator={false} horizontal>
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
  );
};

function createStyles(theme: Theme) {
  return StyleSheet.create({
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
}
