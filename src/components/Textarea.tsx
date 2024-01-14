import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { inputStyles } from '../styles/input';
import { typo } from '../styles/typo';
import { getPadding } from '../styles/utils';

export const Textarea: React.FC = () => {
  const [text, onChangeText] = useState('Dui molestie fermentum bibendum etiam tellus curabitur purus proin.');

  return (
    <View>
      <Text style={typo.calloutEmphasized}>Description</Text>
      <TextInput style={styles.input} onChangeText={onChangeText} value={text} multiline numberOfLines={4} />
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
