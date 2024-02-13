import React, { FC, Suspense } from 'react';
import { DebugTools } from './src/components/DebugTools';
import { GlobalProvider } from './src/providers/GlobalProvider';
import { Main } from './src/screens/Main';
import { Text, TextInput, View } from 'react-native';

const App: FC = () => {
  return (
    // TODO @AdrianFahrbach make pretty
    <View style={{ marginTop: 100, padding: 20 }}>
      <Text>Input</Text>
      <TextInput style={{ backgroundColor: 'grey' }} />
    </View>
  );
};

export default App;
