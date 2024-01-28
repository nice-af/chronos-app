import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { inputStyles } from '../styles/input';
import { typo } from '../styles/typo';

interface TimeInputProps {
  // Needed to blur the input when the modal is closed
  isVisible: boolean;
}

export const TimeInput: React.FC<TimeInputProps> = ({ isVisible }) => {
  const [text, setText] = useState('0:30');
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (!isVisible && inputRef.current) {
      inputRef.current?.blur();
    }
  }, [isVisible]);

  return (
    <View>
      <Text style={typo.calloutEmphasized}>Time</Text>
      <TextInput ref={inputRef} style={styles.input} onChangeText={setText} value={text} multiline numberOfLines={1} />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    ...inputStyles.textInput,
    width: 90,
    height: 42,
    fontSize: 20,
    lineHeight: 26,
  },
});
