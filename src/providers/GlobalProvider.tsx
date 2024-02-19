import { useAtomValue } from 'jotai';
import React, { FC, PropsWithChildren, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { jiraAuthAtom } from '../atoms';
import { Login } from '../screens/Login';
import { initialize } from '../services/global.service';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const GlobalProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const jiraAuth = useAtomValue(jiraAuthAtom);

  useEffect(() => {
    setIsLoading(true);
    initialize().finally(() => {
      setIsLoading(false);
    });
  }, []);

  return isLoading ? (
    <View style={styles.container}>
      <LoadingSpinner />
    </View>
  ) : jiraAuth === null ? (
    <Login />
  ) : (
    children
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
});
