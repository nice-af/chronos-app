import React, { FC, ReactNode, useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, useWindowDimensions } from 'react-native';
import { WIDESCREEN_WINDOW_WIDTH } from '../const';

interface AnimateScreenContainerProps {
  isVisible?: boolean;
  zIndex?: number;
  offScreenLocation: 'left' | 'right';
  children: ReactNode;
  /**
   * Used to handle wide screen layout
   */
  isOverlay?: boolean;
}

export const AnimateScreenContainer: FC<AnimateScreenContainerProps> = ({
  isVisible,
  zIndex,
  offScreenLocation,
  children,
  isOverlay,
}) => {
  const [isRendered, setIsRendered] = useState(false);
  const screenPos = useRef(new Animated.Value(0)).current;
  const { width: windowWidth } = useWindowDimensions();
  const isWideScreenOverlay = isOverlay && windowWidth > WIDESCREEN_WINDOW_WIDTH;

  useEffect(() => {
    if (isVisible) {
      setIsRendered(true);
    } else {
      setTimeout(() => setIsRendered(false), 350);
    }
    // 0 is visible, 1 is not visible
    Animated.timing(screenPos, {
      toValue: isVisible ? 0 : 1,
      duration: 250,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.quad),
    }).start();
  }, [isVisible]);

  return (
    <Animated.View
      style={[
        styles.screenContainer,
        isWideScreenOverlay && styles.screenContainerWide,
        {
          transform: [
            {
              translateX: screenPos.interpolate({
                inputRange: [0, 1],
                outputRange: [
                  0,
                  windowWidth * (offScreenLocation === 'left' ? -1 : 1) * (isWideScreenOverlay ? 0.5 : 1),
                ],
              }),
            },
          ],
          zIndex: zIndex,
        },
        !isRendered && styles.isHidden,
      ]}>
      {isRendered && children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  screenContainerWide: {
    left: '50%',
    width: '50%',
  },
  isHidden: {
    display: 'none',
    pointerEvents: 'none',
  },
});
