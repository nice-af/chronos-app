import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { EditWorklogHeader } from '../components/EditWorklogHeader';
import { IssueTag } from '../components/IssueTag';
import { Layout } from '../components/Layout';
import { NavigationContext } from '../contexts/navigation.context';
import { typo } from '../styles/typo';
import { WorklogCompact } from '../types/global.types';
import { TimeInput } from '../components/TimeInput';
import { Textarea } from '../components/Textarea';

export const EditWorklog: React.FC = () => {
  const { currentWorklogToEdit, setCurrentWorklogToEdit } = useContext(NavigationContext);
  const [selectedWorklog, setSelectedWorklog] = useState<WorklogCompact>({
    id: '',
    issueKey: '',
    issueSummary: '',
    started: '',
    timeSpent: 0,
  });

  useEffect(() => {
    if (!currentWorklogToEdit) {
      return;
    }
    setSelectedWorklog(currentWorklogToEdit);
  }, [currentWorklogToEdit]);

  return (
    <Layout
      header={{
        align: 'left',
        title: (
          <View style={styles.headerContainer}>
            <IssueTag label={selectedWorklog.issueKey} project={'orcaya'} />
            <Text numberOfLines={1} style={styles.title}>
              {selectedWorklog.issueSummary}
            </Text>
          </View>
        ),
        onBackPress: () => setCurrentWorklogToEdit(null),
      }}>
      <EditWorklogHeader
        onDeletePress={() => {}}
        onCancelPress={() => setCurrentWorklogToEdit(null)}
        onSavePress={() => {}}
      />
      <View style={styles.container}>
        <TimeInput isVisible={!!currentWorklogToEdit} />
        <Textarea isVisible={!!currentWorklogToEdit} />
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    padding: 16,
    gap: 16,
  },
  title: {
    ...typo.headline,
    flex: 1,
    marginLeft: 8,
    marginTop: 2,
  },
});
