import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

function App(): JSX.Element {
  // const isDarkMode = useColorScheme() === 'dark';
  const [test, setTest] = useState(false);

  return (
    <View>
      <Pressable onPress={() => setTest(!test)}>
        <Text style={test ? styles.text1 : styles.text2}>Hello World</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  text1: {
    color: 'red',
  },
  text2: {
    color: 'blue',
  },
});

export default App;
