import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

function App(): JSX.Element {
  // const isDarkMode = useColorScheme() === 'dark';

  return (
    <View>
      <Text style={styles.text}>Hello World</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: 'red',
  },
});

export default App;
