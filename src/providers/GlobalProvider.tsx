import { useAtomValue } from 'jotai';
import React, { FC, PropsWithChildren, useEffect, useState } from 'react';
import { Text } from 'react-native';
import { jiraAuthAtom } from '../atoms';
import { Login } from '../screens/Login';
import { initialize } from '../services/global.service';

export const GlobalProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const jiraAuth = useAtomValue(jiraAuthAtom);

  useEffect(() => {
    setIsLoading(true);
    initialize().finally(() => {
      setIsLoading(false);
    });
  }, []);

  // TODO @AdrianFahrbach make pretty
  return isLoading ? <Text>Loading user state...</Text> : jiraAuth === null ? <Login /> : children;
};
