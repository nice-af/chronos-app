import { useAtomValue } from 'jotai';
import React, { FC, ReactNode, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { currentOverlayAtom, jiraAccountTokensAtom, loginsAtom, projectsAtom } from '../atoms';
import { StorageKey, getFromStorage, removeFromStorage } from '../services/storage.service';
import { getPadding } from '../styles/utils';

interface DebugToolsTabProps {
  defaultExpanded?: boolean;
  title: string;
  children?: ReactNode;
}

export const DebugToolsTab: FC<DebugToolsTabProps> = ({ defaultExpanded, title, children }) => {
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

export const DebugTools: FC = () => {
  const [expanded, setExpanded] = useState(false);
  const jiraLogins = useAtomValue(loginsAtom);
  const jiraAccountTokens = useAtomValue(jiraAccountTokensAtom);
  const projects = useAtomValue(projectsAtom);
  const currentOverlay = useAtomValue(currentOverlayAtom);

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
          <Pressable
            onPress={async () => console.log(await getFromStorage(StorageKey.LOGINS))}
            style={{ marginBottom: 6 }}>
            <Text style={styles.tabTitle}>Log logins storage</Text>
          </Pressable>
          <Pressable
            onPress={async () => console.log(await getFromStorage(StorageKey.JIRA_ACCOUNT_TOKENS))}
            style={{ marginBottom: 12 }}>
            <Text style={styles.tabTitle}>Log accountTokens storage</Text>
          </Pressable>
          <Pressable
            onPress={async () => {
              Object.values(StorageKey).forEach(key => removeFromStorage(key));
            }}
            style={{ marginBottom: 12 }}>
            <Text style={styles.tabTitle}>Clear all storage</Text>
          </Pressable>
          <DebugToolsTab title='jiraLogins'>
            <Text>{JSON.stringify(jiraLogins, null, 2)}</Text>
          </DebugToolsTab>
          <DebugToolsTab title='jiraAccountTokens'>
            <Text>{JSON.stringify(jiraAccountTokens, null, 2)}</Text>
          </DebugToolsTab>
          <DebugToolsTab title='projects'>
            <Text>{JSON.stringify(projects, null, 2)}</Text>
          </DebugToolsTab>
          <DebugToolsTab title='currentOverlay'>
            <Text>{JSON.stringify({ currentOverlay }, null, 2)}</Text>
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
    zIndex: 999999,
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
