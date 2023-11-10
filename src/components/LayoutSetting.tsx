import React, { useContext, useState } from 'react';
import { Image, ImageSourcePropType, Pressable, StyleSheet, Text, View } from 'react-native';
import { GlobalContext } from '../contexts/global.context';
import { colors } from '../styles/colors';
import { typo } from '../styles/typo';
import { Layout } from '../types/global.types';

const layoutToLabelMap: Record<Layout, string> = {
  normal: 'Normal',
  compact: 'Compact',
  micro: 'Micro',
};

interface LayoutSettingButtonProps {
  option: Layout;
  image: ImageSourcePropType;
}

const LayoutSettingButton: React.FC<LayoutSettingButtonProps> = ({ option, image }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const { layout, setLayout } = useContext(GlobalContext);

  const isChecked = layout === option;

  return (
    <View style={styles.pressableContainer}>
      {isChecked && <View style={styles.checkedBorder} />}
      <Pressable
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        onPress={() => setLayout(option)}
        style={styles.pressable}>
        <View
          style={[
            styles.highlight,
            isHovered && styles.highlightHovered,
            isChecked && styles.highlightHovered,
            isPressed && styles.highlightPressed,
          ]}
        />
        <Image style={styles.image} source={image} />
      </Pressable>
      <Text style={isChecked ? styles.labelChecked : styles.label}>{layoutToLabelMap[option]}</Text>
    </View>
  );
};

export const LayoutSettings: React.FC = () => {
  return (
    <View style={styles.layoutSettingsContainer}>
      <LayoutSettingButton option='normal' image={require('../assets/settings/layout-normal.png')} />
      <LayoutSettingButton option='compact' image={require('../assets/settings/layout-compact.png')} />
      <LayoutSettingButton option='micro' image={require('../assets/settings/layout-micro.png')} />
    </View>
  );
};

const styles = StyleSheet.create({
  layoutSettingsContainer: {
    display: 'flex',
    gap: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  pressableContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 2,
  },
  pressable: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    width: 76,
    height: 48,
    padding: 0,
    borderRadius: 10,
    borderColor: colors.border,
    borderWidth: 1,
  },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 74,
    height: 46,
    zIndex: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderRadius: 8,
  },
  highlightHovered: {
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  highlightPressed: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  checkedBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 80,
    height: 52,
    borderColor: colors.blue,
    borderWidth: 2,
    borderRadius: 11,
  },
  image: {
    width: 74,
    height: 46,
    borderRadius: 8,
  },
  labelChecked: {
    marginTop: 2,
    ...typo.subheadlineEmphasized,
    color: colors.textPrimary,
  },
  label: {
    marginTop: 2,
    ...typo.subheadline,
    color: colors.textPrimary,
  },
});
