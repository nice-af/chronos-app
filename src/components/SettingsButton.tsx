import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet } from 'react-native';
import { NavigationContext } from '../contexts/navigation.context';
import { ThemeContext } from '../contexts/theme.context';

export const dayPickerHeight = 56;

export const SettingsButton: FC = () => {
  const { showSettingsScreen, setShowSettingsScreen } = useContext(NavigationContext);
  const [isHovered, setIsHovered] = useState(false);
  const { theme } = useContext(ThemeContext);
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(rotation, {
      toValue: showSettingsScreen ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.quad),
    }).start();
  }, [showSettingsScreen]);

  return (
    <Pressable
      style={({ pressed }) => [styles.pressable, isHovered && { opacity: 0.8 }, pressed && { opacity: 0.7 }]}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      onPress={() => setShowSettingsScreen(!showSettingsScreen)}>
      <Animated.Image
        style={[
          styles.cog,
          {
            transform: [
              {
                rotate: rotation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '51.49deg'],
                }),
              },
            ],
          },
        ]}
        source={
          theme.type === 'light' ? require('../assets/icons/cog-light.png') : require('../assets/icons/cog-dark.png')
        }
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    marginTop: 6,
  },
  cog: {
    width: 24,
    height: 24,
  },
});
