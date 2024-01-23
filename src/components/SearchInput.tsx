import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { inputStyles } from '../styles/input';
import { typo } from '../styles/typo';
import { getPadding } from '../styles/utils';

export const SearchInput: React.FC = () => {
  const [text, setText] = useState('Search...');

  return (
    <View>
      <TextInput style={styles.input} onChangeText={setText} value={text} />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    ...inputStyles.textInput,
    width: '100%',
    ...getPadding(8, 12),
  },
});
