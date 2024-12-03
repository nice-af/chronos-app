/**
 * This file is disabeld for now because the Picker component causes problems on MacOS and our Windows version is on hold for now.
 * To re-enable this file, you need to install the `@react-native-picker/picker` package and uncomment the code below.
 */

// import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { OptionValue, SelectProps } from './Select.types';

export function Select<T extends OptionValue>({ options, value, onChange }: SelectProps<T>) {
  const [selectedValue, setSelectedValue] = useState(value);

  return (
    <View />
    // <Picker
    //   style={styles.picker}
    //   selectedValue={selectedValue}
    //   onValueChange={itemValue => {
    //     setSelectedValue(itemValue);
    //     onChange(itemValue);
    //   }}>
    //   {options.map(option => (
    //     <Picker.Item label={option.label} value={option.value} key={option.value} />
    //   ))}
    // </Picker>
  );
}

const styles = StyleSheet.create({
  picker: {
    flexBasis: 170,
    flexShrink: 1,
  },
});
