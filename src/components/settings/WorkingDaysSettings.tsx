import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import React, { FC, useEffect, useState } from 'react';
import { Animated, Easing, OpaqueColorValue, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { settingsAtom, themeAtom, workingDaysAndTimeAtom } from '../../atoms';
import { useTranslation } from '../../services/i18n.service';
import { useThemedStyles } from '../../services/theme.service';
import { createSettingsStyles } from '../../styles/settings';
import { Theme } from '../../styles/theme/theme-types';
import { typo } from '../../styles/typo';
import { DayCode, weekDays } from '../../types/global.types';
import { HorizontalScrollWithFade } from '../HorizontalScrollWithFade';
import { Toggle } from '../Toggle';

interface WorkingDaysSettingProps {
  dayCode: DayCode;
  label: string;
}

const WorkingDaysSettingButton: FC<WorkingDaysSettingProps> = ({ dayCode, label }) => {
  const workingDaysAndTime = useAtomValue(workingDaysAndTimeAtom);
  const setSettings = useSetAtom(settingsAtom);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const theme = useAtomValue(themeAtom);
  const styles = useThemedStyles(createStyles);
  const isChecked = workingDaysAndTime[dayCode].enabled;
  const [animatedValue] = useState(new Animated.Value(isChecked ? 1 : 0));
  const [pressedValue] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isChecked ? 1 : 0,
      duration: 200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [isChecked]);

  useEffect(() => {
    Animated.timing(pressedValue, {
      toValue: isPressed ? 1 : 0,
      duration: 100,
      useNativeDriver: false,
    }).start();
  }, [isPressed]);

  // We need to ensure that the color values are strings.
  function getColor(val: string | OpaqueColorValue) {
    return typeof val === 'string' ? val : '#fff';
  }

  // Animate between base and hover
  const bgHoverAnim = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [getColor(theme.surfaceButtonHover), getColor(theme.buttonHover)],
  });
  const bgBaseAnim = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [getColor(theme.surfaceButtonBase), getColor(theme.buttonBase)],
  });
  const bgActiveAnim = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [getColor(theme.surfaceButtonActive), getColor(theme.buttonActive)],
  });

  // Interpolate between base/hover/active using pressed/hovered state
  let backgroundColorAnim = bgBaseAnim;
  if (isPressed) {
    backgroundColorAnim = bgActiveAnim;
  } else if (isHovered) {
    backgroundColorAnim = bgHoverAnim;
  }

  // Label color interpolation with fallback
  const labelColorFrom = getColor(theme.textSecondary);
  const labelColorTo = getColor(theme.textPrimary);
  const labelColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [labelColorFrom, labelColorTo],
  });
  const labelTop = animatedValue.interpolate({ inputRange: [0, 1], outputRange: [13, 2] });
  const inputOpacity = animatedValue;
  const inputPointerEvents = isChecked ? 'auto' : 'none';

  function handlePress() {
    setSettings(currentSettings => {
      const updatedWorkingDays = { ...currentSettings.workingDaysAndTime };
      updatedWorkingDays[dayCode].enabled = !updatedWorkingDays[dayCode].enabled;
      return { ...currentSettings, workingDaysAndTime: updatedWorkingDays };
    });
  }

  return (
    <Pressable
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      onPress={handlePress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={styles.pressable}>
      <Animated.View
        style={[StyleSheet.absoluteFill, { borderRadius: 6, backgroundColor: backgroundColorAnim }]}
        pointerEvents='none'
      />
      <View style={styles.borderInset} />
      <Animated.Text
        style={[
          styles.label,
          {
            color: labelColor,
            top: labelTop,
          },
        ]}>
        {label}
      </Animated.Text>
      <Animated.View
        style={[styles.pressableInput, isFocused && styles.pressableInputFocused, { opacity: inputOpacity }]}
        pointerEvents={inputPointerEvents}>
        <TextInput
          style={{ flex: 1, textAlign: 'center', borderWidth: 0 }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </Animated.View>
    </Pressable>
  );
};

export const WorkingDaysSetting: FC = () => {
  const settingsStyles = useThemedStyles(createSettingsStyles);
  const [settings, setSettings] = useAtom(settingsAtom);
  const styles = useThemedStyles(createStyles);
  const { t } = useTranslation();

  return (
    <View style={settingsStyles.card}>
      <Text style={settingsStyles.headline}>{t('weekDays.settingsTitle')}</Text>
      <HorizontalScrollWithFade style={styles.container} contentContainerStyle={{ gap: 6, alignItems: 'flex-start' }}>
        {weekDays.map(dayCode => (
          <WorkingDaysSettingButton key={dayCode} dayCode={dayCode} label={t(`weekDays.${dayCode}`)} />
        ))}
      </HorizontalScrollWithFade>
      <Toggle
        label={t('weekDays.hideNonWorkingDays')}
        state={settings.hideNonWorkingDays}
        setState={newState => setSettings(cur => ({ ...cur, hideNonWorkingDays: newState }))}
      />
    </View>
  );
};

function createStyles(theme: Theme) {
  // This needs to be assigned to `styles` for react-native/no-unused-styles to work
  const styles = StyleSheet.create({
    container: {
      display: 'flex',
      gap: 6,
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 10,
    },
    pressable: {
      position: 'relative',
      width: 40,
      height: 48,
      borderRadius: 6,
    },
    borderInset: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: 40,
      height: 48,
      borderWidth: 1,
      borderColor: theme.borderInset,
      borderRadius: 6,
    },
    label: {
      ...typo.bodyEmphasized,
      color: theme.textSecondary,
      textAlign: 'center',
      width: 40,
      top: 13,
    },
    pressableInput: {
      position: 'absolute',
      bottom: 3,
      left: 3,
      width: 34,
      height: 22,
      opacity: 0,
      pointerEvents: 'none',
      backgroundColor: theme.workingDayButtonInputBg,
      borderRadius: 3,
      zIndex: 2,
      textAlign: 'center',
      borderWidth: 1,
      borderColor: theme.workingDayButtonInputBorder,
    },
    pressableInputFocused: {
      borderColor: theme.textSecondary,
    },
  });
  return styles;
}
