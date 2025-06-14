import { useAtomValue } from 'jotai';
import React, { FC, ReactNode, useMemo, useState } from 'react';
import {
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { themeAtom } from '../atoms';

interface HorizontalScrollWithFadeProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export const HorizontalScrollWithFade: FC<HorizontalScrollWithFadeProps> = ({
  children,
  style,
  contentContainerStyle,
}) => {
  const theme = useAtomValue(themeAtom);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(true);

  const fadeImages = useMemo(() => {
    const currentTheme = theme.type as 'light' | 'dark';
    return {
      left:
        currentTheme === 'light'
          ? require('../assets/fades/fade-left-light.png')
          : require('../assets/fades/fade-left-dark.png'),
      right:
        currentTheme === 'light'
          ? require('../assets/fades/fade-right-light.png')
          : require('../assets/fades/fade-right-dark.png'),
    };
  }, [theme.type]);

  function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const scrollX = contentOffset.x;
    const contentWidth = contentSize.width;
    const containerWidth = layoutMeasurement.width;
    setShowLeftFade(scrollX > 5);
    setShowRightFade(scrollX < contentWidth - containerWidth - 5);
  }

  return (
    <View style={[styles.wrapper, style]}>
      <ScrollView
        contentContainerStyle={[styles.container, contentContainerStyle]}
        showsHorizontalScrollIndicator={false}
        horizontal
        onScroll={handleScroll}
        scrollEventThrottle={16}>
        {children}
      </ScrollView>
      {showLeftFade && (
        <View style={[styles.fadeOverlay, styles.leftFade]} pointerEvents='none'>
          <Image source={fadeImages.left} style={styles.fadeImage} />
        </View>
      )}
      {showRightFade && (
        <View style={[styles.fadeOverlay, styles.rightFade]} pointerEvents='none'>
          <Image source={fadeImages.right} style={styles.fadeImage} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    overflow: 'hidden',
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    padding: 4,
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
    resizeMode: 'repeat',
    overflow: 'hidden',
  },
  leftFade: {
    left: 0,
  },
  rightFade: {
    right: 12,
  },
});
