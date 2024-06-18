import React, { FC, useEffect, useRef } from 'react';
import { Animated, Easing, Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useThemedStyles } from '../../services/theme.service';
import { Theme } from '../../styles/theme/theme-types';
import { getPadding } from '../../styles/utils';

interface ModalContainerProps {
  children: React.ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  isVisible: boolean;
}

export const ModalContainer: FC<ModalContainerProps> = ({ children, contentContainerStyle, isVisible }) => {
  const styles = useThemedStyles(createStyles);
  const animBackground = useRef(new Animated.Value(0)).current;
  const animJump = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animBackground, {
      toValue: isVisible ? 1 : 0,
      duration: 150,
      useNativeDriver: true,
      easing: Easing.ease,
    }).start();
    Animated.timing(animJump, {
      toValue: isVisible ? 1 : 0,
      duration: 150,
      useNativeDriver: true,
      easing: Easing.bezier(0.57, 1.66, 0.45, 0.915),
    }).start();
  }, [isVisible]);

  return (
    <View style={[styles.container, { pointerEvents: isVisible ? undefined : 'none' }]}>
      <Animated.View
        style={[
          styles.backdropContainer,
          {
            opacity: animBackground.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
            }),
          },
        ]}
      />
      <Animated.View
        style={[
          [styles.contentContainer, contentContainerStyle],
          {
            opacity: animBackground.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
            }),
            transform: [
              {
                scale: animJump.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1],
                }),
              },
            ],
          },
        ]}>
        {Platform.OS !== 'windows' && <View style={styles.insetBorder} />}
        <View style={styles.content}>{children}</View>
      </Animated.View>
    </View>
  );
};

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 997,
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    backdropContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 997,
      width: '100%',
      height: '100%',
      backgroundColor: theme.backdrop,
    },
    contentContainer: {
      width: '100%',
      maxWidth: 330,
      zIndex: 998,
      backgroundColor: theme.backgroundSolid,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 36,
      },
      shadowOpacity: 0.7,
      shadowRadius: 100,
      overflow: 'hidden',
    },
    content: {
      ...getPadding(20, 20, 16, 20),
    },
    insetBorder: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderWidth: 1,
      borderColor: theme.dayButtonBorderInset,
      borderRadius: 10,
    },
  });
}
