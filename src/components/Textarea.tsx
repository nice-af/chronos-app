import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { inputStyles } from '../styles/input';
import { typo } from '../styles/typo';
import { getPadding } from '../styles/utils';

interface TextareaProps {
  // Needed to blur the input when the modal is closed
  isVisible: boolean;
}

export const Textarea: React.FC<TextareaProps> = ({ isVisible }) => {
  const [text, setText] = useState('Dui molestie fermentum bibendum etiam tellus curabitur purus proin.');
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (!isVisible && inputRef.current) {
      inputRef.current?.blur();
    }
  }, [isVisible]);

  return (
    <View>
      <Text style={typo.calloutEmphasized}>Description</Text>
      <TextInput ref={inputRef} style={styles.input} onChangeText={setText} value={text} multiline numberOfLines={4} />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    ...inputStyles.textInput,
    width: '100%',
    height: 100,
    ...getPadding(8, 12),
  },
});
