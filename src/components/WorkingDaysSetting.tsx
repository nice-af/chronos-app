import { useAtomValue, useSetAtom } from 'jotai';
import React, { FC, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { settingsAtom, themeAtom, workingDaysAtom } from '../atoms';
import { useTranslation } from '../services/i18n.service';
import { useThemedStyles } from '../services/theme.service';
import { Theme } from '../styles/theme/theme-types';
import { typo } from '../styles/typo';
import { getPadding } from '../styles/utils';
import { DayId, weekDays } from '../types/global.types';

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
      <Text style={isChecked ? styles.labelChecked : styles.label}>{label}</Text>
    </Pressable>
  );
};

export const WorkingDaysSetting: FC = () => {
  const styles = useThemedStyles(createStyles);
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {weekDays.map(weekDay => (
        <WorkingDaysSettingButton key={weekDay.id} id={weekDay.id} label={t(`weekDays.${weekDay.code}`)} />
      ))}
    </View>
  );
};

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      display: 'flex',
      gap: 6,
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 10,
    },
    pressable: {
      width: 34,
      ...getPadding(7, 8, 9),
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
}
