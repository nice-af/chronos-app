import React, { FC, useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, ViewProps } from 'react-native';
import { useThemedStyles } from '../services/theme.service';
import { Theme } from '../styles/theme/theme-types';

export const AnimatedCheckmarkIcon: FC<ViewProps> = ({ ...props }) => {
  const styles = useThemedStyles(createStyles);
  const fillAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fillAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: false,
    }).start();
  }, []);

  return (
    <View {...props} style={[styles.container, props.style]}>
      <View style={styles.legContainer}>
        <Animated.View
          style={[
            styles.fill,
            {
              transformOrigin: 'left',
              transform: [{ scaleX: fillAnim.interpolate({ inputRange: [0, 0.3], outputRange: [0, 1] }) }],
            },
          ]}
        />
      </View>
      <View style={styles.stemContainer}>
        <Animated.View
          style={[
            styles.fill,
            {
              transformOrigin: 'bottom',
              transform: [{ scaleY: fillAnim.interpolate({ inputRange: [0.3, 1], outputRange: [0, 1] }) }],
            },
          ]}
        />
      </View>
    </View>
  );
};

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      position: 'relative',
      width: 6,
      height: 13,
      transform: [{ rotate: '45deg' }],
    },
    legContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: 6,
      height: 2,
      borderTopLeftRadius: 1,
      borderBottomLeftRadius: 1,
      overflow: 'hidden',
    },
    stemContainer: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 2,
      height: 13,
      borderTopLeftRadius: 1,
      borderTopRightRadius: 1,
      overflow: 'hidden',
    },
    fill: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: theme.green,
    },
  });
}
