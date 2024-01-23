import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { inputStyles } from '../styles/input';
import { getPadding } from '../styles/utils';

interface SearchInputProps {
  // Needed to blur the input when the modal is closed
  isVisible: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({ isVisible }) => {
  const [text, setText] = useState('Search...');

  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (!isVisible && inputRef.current) {
      inputRef.current?.blur();
    }
  }, [isVisible]);

  return (
    <View>
      <TextInput ref={inputRef} style={styles.input} onChangeText={setText} value={text} />
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
