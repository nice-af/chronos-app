import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { OptionValue, SelectProps } from './Select.types';

export function Select<T extends OptionValue>({ options, value, onChange }: SelectProps<T>) {
  const [selectedValue, setSelectedValue] = useState(value);

  return (
    <Picker
      style={styles.picker}
      selectedValue={selectedValue}
      onValueChange={itemValue => {
        setSelectedValue(itemValue);
        onChange(itemValue);
      }}>
      {options.map(option => (
        <Picker.Item label={option.label} value={option.value} key={option.value} />
      ))}
    </Picker>
  );
}

const styles = StyleSheet.create({
  picker: {
    flexBasis: 80,
    flexShrink: 1,
  },
});
