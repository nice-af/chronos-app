import React, { useState } from 'react';
import { Image, Pressable, PressableProps, StyleSheet, ViewStyle } from 'react-native';

interface PlusButtonProps extends Omit<PressableProps, 'style'> {
  onPress: () => void;
  style?: ViewStyle;
}

export const PlusButton: React.FC<PlusButtonProps> = ({ onPress, ...props }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Pressable
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      onPress={onPress}
      style={({ pressed }) => [styles.default, isHovered && styles.isHovered, pressed && styles.isActive, props.style]}>
      <Image style={styles.plus} source={require('../assets/icon-plus.png')} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  default: {
    padding: 6,
    margin: -6,
    backgroundColor: 'transparent',
    borderRadius: 5,
  },
  isHovered: {
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  isActive: {
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  plus: {
    width: 16,
    height: 16,
  },
});
