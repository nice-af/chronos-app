import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { inputStyles } from '../styles/input';
import { typo } from '../styles/typo';

export const TimeInputField: React.FC = () => {
  const [text, onChangeText] = useState('0:30');

  return (
    <View>
      <Text style={typo.calloutEmphasized}>Time</Text>
      <TextInput style={styles.input} onChangeText={onChangeText} value={text} />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    ...inputStyles.textInput,
    width: 90,
    height: 42,
    fontSize: 20,
    lineHeight: 22,
  },
});
