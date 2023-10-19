import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export function padding(a: number, b?: number, c?: number, d?: number) {
  return {
    paddingTop: a,
    paddingRight: b ?? a,
    paddingBottom: c ?? a,
    paddingLeft: d ?? b ?? a,
  };
}

function App(): JSX.Element {
  // const isDarkMode = useColorScheme() === 'dark';
  const [isChecked, setIsChecked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <View>
      <Pressable
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
        onPress={() => setIsChecked(!isChecked)}
        style={({ pressed }) => [styles.pressable, isHovered && styles.isHovered, pressed && styles.isActive]}>
        <Text>Hello World</Text>
      </Pressable>
      {isChecked && <Text>Checked</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  pressable: {
    alignSelf: 'flex-start',
    color: 'red',
    backgroundColor: '#0B84FF',
    ...padding(6, 12),
  },
  isHovered: {
    backgroundColor: '#0872dd',
  },
  isActive: {
    backgroundColor: '#0b6ac9',
  },
});

export default App;
