import React, { useContext, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { GlobalContext } from '../contexts/global.context';
import { ThemeContext } from '../contexts/theme.context';
import { useThemedStyles } from '../services/theme.service';
import { Theme } from '../styles/theme/theme-types';
import { typo } from '../styles/typo';
import { getPadding } from '../styles/utils';
import { DayId, DayLabel, weekDays } from '../types/global.types';

interface WorkingDaysSettingProps {
  id: DayId;
  label: DayLabel;
}

const WorkingDaysSettingButton: React.FC<WorkingDaysSettingProps> = ({ id, label }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { workingDays, setWorkingDays } = useContext(GlobalContext);
  const { theme } = useContext(ThemeContext);
  const styles = useThemedStyles(createStyles);
  const isChecked = workingDays.includes(id);

  const handlePress = () => {
    let newWorkingDays: DayId[] = [];
    if (isChecked) {
      newWorkingDays = workingDays.filter(day => day !== id);
    } else {
      newWorkingDays = [...workingDays, id];
    }
    setWorkingDays(newWorkingDays);
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

export const WorkingDaysSetting: React.FC = () => {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.container}>
      {weekDays.map(weekDay => (
        <WorkingDaysSettingButton key={weekDay.id} id={weekDay.id} label={weekDay.abbreviation} />
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
