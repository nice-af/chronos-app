import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import React, { FC, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { settingsAtom, themeAtom, workingDaysAtom } from '../../atoms';
import { useTranslation } from '../../services/i18n.service';
import { useThemedStyles } from '../../services/theme.service';
import { createSettingsStyles } from '../../styles/settings';
import { Theme } from '../../styles/theme/theme-types';
import { typo } from '../../styles/typo';
import { getPadding } from '../../styles/utils';
import { DayId, weekDays } from '../../types/global.types';
import { Toggle } from '../Toggle';

interface WorkingDaysSettingProps {
  id: DayId;
  label: string;
}

const WorkingDaysSettingButton: FC<WorkingDaysSettingProps> = ({ id, label }) => {
  const workingDays = useAtomValue(workingDaysAtom);
  const setSettings = useSetAtom(settingsAtom);
  const [isHovered, setIsHovered] = useState(false);
  const theme = useAtomValue(themeAtom);
  const styles = useThemedStyles(createStyles);
  const isChecked = workingDays.includes(id);

  const handlePress = () => {
    let newWorkingDays: DayId[] = [];
    if (isChecked) {
      newWorkingDays = workingDays.filter(day => day !== id);
    } else {
      newWorkingDays = [...workingDays, id];
    }
    setSettings(cur => ({ ...cur, workingDays: newWorkingDays }));
  };

  return (
    <Pressable
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.pressable,
        { backgroundColor: isChecked ? theme.buttonBase : theme.surfaceButtonBase },
        isHovered && { backgroundColor: isChecked ? theme.buttonHover : theme.surfaceButtonHover },
        pressed && { backgroundColor: isChecked ? theme.buttonActive : theme.surfaceButtonActive },
      ]}>
      <View style={styles.borderInset} />
      <Text style={isChecked ? styles.labelChecked : styles.label}>{label}</Text>
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
      <View style={styles.container}>
        {weekDays.map(weekDay => (
          <WorkingDaysSettingButton key={weekDay.id} id={weekDay.id} label={t(`weekDays.${weekDay.code}`)} />
        ))}
      </View>
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
      width: 34,
      height: 30,
      ...getPadding(7, 8, 9),
      borderRadius: 6,
    },
    borderInset: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: 34,
      height: 30,
      borderWidth: 1,
      borderColor: theme.borderInset,
      borderRadius: 6,
    },
    labelChecked: {
      ...typo.subheadlineEmphasized,
      color: theme.textButton,
      textAlign: 'center',
    },
    label: {
      ...typo.subheadline,
      color: theme.textPrimary,
      textAlign: 'center',
    },
  });
  return styles;
}
