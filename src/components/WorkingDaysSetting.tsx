import React, { useContext, useState } from 'react';
import { Image, ImageSourcePropType, Pressable, StyleSheet, Text, View } from 'react-native';
import { GlobalContext } from '../contexts/global.context';
import { colors } from '../styles/colors';
import { typo } from '../styles/typo';
import { DayId, DayLabel, Layout, weekDays } from '../types/global.types';
import { getPadding } from '../styles/utils';

interface WorkingDaysSettingProps {
  id: DayId;
  label: DayLabel;
}

const WorkingDaysSettingButton: React.FC<WorkingDaysSettingProps> = ({ id, label }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { workingDays, setWorkingDays } = useContext(GlobalContext);

  const isChecked = workingDays.includes(id);

  function handlePress() {
    let newWorkingDays: DayId[] = [];
    if (isChecked) {
      newWorkingDays = workingDays.filter(day => day !== id);
    } else {
      newWorkingDays = [...workingDays, id];
    }
    setWorkingDays(newWorkingDays);
  }

  return (
    <Pressable
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.pressable,
        { backgroundColor: isChecked ? colors.buttonBase : colors.surfaceButtonBase },
        isHovered && { backgroundColor: isChecked ? colors.buttonHover : colors.surfaceButtonHover },
        pressed && { backgroundColor: isChecked ? colors.buttonActive : colors.surfaceButtonActive },
      ]}>
      <Text style={isChecked ? styles.labelChecked : styles.label}>{label}</Text>
    </Pressable>
  );
};

export const WorkingDaysSetting: React.FC = () => {
  return (
    <View style={styles.container}>
      {weekDays.map(weekDay => (
        <WorkingDaysSettingButton key={weekDay.id} id={weekDay.id} label={weekDay.abbreviation} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
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
    color: colors.textPrimary,
    textAlign: 'center',
  },
  label: {
    ...typo.subheadline,
    color: colors.textPrimary,
    textAlign: 'center',
  },
});
