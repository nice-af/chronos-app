import React, { useContext, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { GlobalContext } from '../contexts/global.context';
import { getPadding } from '../styles/utils';
import { NavigationContext } from '../contexts/navigation.context';

interface DebugToolsTabProps {
  defaultExpanded?: boolean;
  title: string;
  children?: React.ReactNode;
}

export const DebugToolsTab: React.FC<DebugToolsTabProps> = ({ defaultExpanded, title, children }) => {
  const [expanded, setExpanded] = useState(defaultExpanded ?? false);

  return (
    <View style={styles.tabContainer}>
      <Pressable style={styles.tabHeader} onPress={() => setExpanded(!expanded)}>
        <Text style={styles.tabTitle}>{title}</Text>
      </Pressable>
      {expanded && <Text style={styles.tabChildren}>{children}</Text>}
    </View>
  );
};

export const DebugTools: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const { apiSettings, worklogs, userInfo } = useContext(GlobalContext);
  const { showLoginScreen, showSettingsScreen } = useContext(NavigationContext);

  if (!expanded) {
    return (
      <Pressable style={styles.smallContainer} onPress={() => setExpanded(true)}>
        <Text style={styles.title}>DEBUG</Text>
      </Pressable>
    );
  } else {
    return (
      <View style={styles.largeContainer}>
        <Pressable style={styles.xButton} onPress={() => setExpanded(false)}>
          <Text style={styles.xButtonTitle}>X</Text>
        </Pressable>
        <ScrollView>
          <DebugToolsTab title='apiSettings'>
            <Text>{JSON.stringify(apiSettings, null, 2)}</Text>
          </DebugToolsTab>
          <DebugToolsTab title='worklogs'>
            <Text>{JSON.stringify(worklogs, null, 2)}</Text>
          </DebugToolsTab>
          <DebugToolsTab title='userInfo'>
            <Text>{JSON.stringify(userInfo, null, 2)}</Text>
          </DebugToolsTab>
          <DebugToolsTab title='navigationContext'>
            <Text>{JSON.stringify({ showLoginScreen, showSettingsScreen }, null, 2)}</Text>
          </DebugToolsTab>
        </ScrollView>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  smallContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    zIndex: 999999,
    height: 20,
    backgroundColor: 'white',
    padding: 2,
  },
  title: {
    color: 'black',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  largeContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    zIndex: 999999,
    width: '100%',
    height: 300,
    backgroundColor: 'white',
    padding: 10,
  },
  xButton: {
    position: 'absolute',
    top: 2,
    right: 2,
    zIndex: 9999999,
    padding: 6,
    width: 24,
    backgroundColor: 'black',
  },
  xButtonTitle: {
    color: 'white',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tabContainer: {
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
  },
  tabHeader: {
    ...getPadding(2, 4),
    backgroundColor: '#e0e0e0',
  },
  tabTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'left',
  },
  tabChildren: {
    fontSize: 12,
    color: 'black',
    textAlign: 'left',
  },
});
