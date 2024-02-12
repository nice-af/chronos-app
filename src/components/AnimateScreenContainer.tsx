import React, { FC, ReactNode, useEffect, useRef, useState } from 'react';
import { Animated, Easing, Platform, StyleSheet, useWindowDimensions } from 'react-native';

interface AnimateScreenContainerProps {
  isVisible?: boolean;
  zIndex?: number;
  offScreenLocation: 'left' | 'right';
  children: ReactNode;
}

export const AnimateScreenContainer: FC<AnimateScreenContainerProps> = ({
  isVisible,
  zIndex,
  offScreenLocation,
  children,
}) => {
  const [isRendered, setIsRendered] = useState(false);
  const screenPos = useRef(new Animated.Value(0)).current;
  const { width: windowWidth } = useWindowDimensions();

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

  if (!isRendered) {
    return null;
  }

  // TODO @AdrianFahrbach fix this for windows
  if (Platform.OS === 'windows') {
    return children;
  }

  return (
    <Animated.View
      style={[
        styles.screenContainer,
        {
          transform: [
            {
              translateX: screenPos.interpolate({
                inputRange: [0, 1],
                outputRange: [0, windowWidth * (offScreenLocation === 'left' ? -1 : 1)],
              }),
            },
          ],
          zIndex: zIndex,
        },
      ]}>
      {children}
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
});
