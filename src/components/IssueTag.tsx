import React, { useState } from 'react';
import { Image, Pressable, PressableProps, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { colors } from '../styles/colors';
import { getPadding } from '../styles/utils';
import { typo } from '../styles/typo';
import transparentize from 'polished/lib/color/transparentize';

export type Project = 'tmh' | 'orcaya' | 'solid';

const themes: Record<string, { text: TextStyle; bg: ViewStyle }> = {
  red: {
    text: { color: colors.red },
    bg: { backgroundColor: transparentize(0.75, colors.red) },
  },
  orange: {
    text: { color: colors.orange },
    bg: { backgroundColor: transparentize(0.75, colors.orange) },
  },
  yellow: {
    text: { color: colors.yellow },
    bg: { backgroundColor: transparentize(0.75, colors.yellow) },
  },
  green: {
    text: { color: colors.green },
    bg: { backgroundColor: transparentize(0.75, colors.green) },
  },
  mint: {
    text: { color: colors.mint },
    bg: { backgroundColor: transparentize(0.75, colors.mint) },
  },
  teal: {
    text: { color: colors.teal },
    bg: { backgroundColor: transparentize(0.75, colors.teal) },
  },
  cyan: {
    text: { color: colors.cyan },
    bg: { backgroundColor: transparentize(0.75, colors.cyan) },
  },
  blue: {
    text: { color: colors.blue },
    bg: { backgroundColor: transparentize(0.75, colors.blue) },
  },
  indigo: {
    text: { color: colors.indigo },
    bg: { backgroundColor: transparentize(0.75, colors.indigo) },
  },
  purple: {
    text: { color: colors.purple },
    bg: { backgroundColor: transparentize(0.75, colors.purple) },
  },
  pink: {
    text: { color: colors.pink },
    bg: { backgroundColor: transparentize(0.75, colors.pink) },
  },
  gray: {
    text: { color: colors.gray },
    bg: { backgroundColor: transparentize(0.75, colors.gray) },
  },
  brown: {
    text: { color: colors.brown },
    bg: { backgroundColor: transparentize(0.75, colors.brown) },
  },
};
const themeKeys = Object.keys(themes);

function hashStr(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    hash += charCode;
  }
  return hash;
}

interface IssueTagProps extends Omit<PressableProps, 'style'> {
  label: string;
  project: Project;
  onPress: () => void;
  style?: ViewStyle;
}

export const IssueTag: React.FC<IssueTagProps> = ({ onPress, label, project, ...props }) => {
  const [isHovered, setIsHovered] = useState(false);

  const theme = themes[themeKeys[hashStr(label) % themeKeys.length]];

  return (
    <Pressable
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      onPress={onPress}
      style={({ pressed }) => [
        styles.default,
        isHovered && styles.isHovered,
        pressed && styles.isSelected,
        props.style,
      ]}>
      {project === 'tmh' && <Image style={styles.logo} source={require('../assets/logo-tmh.png')} />}
      {project === 'orcaya' && <Image style={styles.logo} source={require('../assets/logo-orcaya.png')} />}
      {project === 'solid' && <Image style={styles.logo} source={require('../assets/logo-solid.png')} />}
      <View style={[styles.labelContainer, theme.bg]}>
        <Text style={[styles.label, theme.text]}>{label}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  default: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'flex-start',
    height: 20,
    borderRadius: 5,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  isHovered: {
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  isSelected: {
    opacity: 0.75,
  },
  logo: {
    width: 20,
    height: 20,
    marginRight: 2,
  },
  labelContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    ...getPadding(3.5, 5),
    height: 20,
  },
  label: {
    ...typo.subheadlineEmphasized,
    color: colors.textSecondary,
  },
});
