import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CustomTextInput } from '../components/CustomTextInput';
import { EditWorklogHeader } from '../components/EditWorklogHeader';
import { IssueTag } from '../components/IssueTag';
import { Layout } from '../components/Layout';
import { NavigationContext } from '../contexts/navigation.context';
import { typo } from '../styles/typo';
import { WorklogCompact } from '../types/global.types';
import { EditWorklogFooter } from '../components/EditWorklogFooter';

export const EditWorklog: React.FC = () => {
  const { currentWorklogToEdit, setCurrentWorklogToEdit } = useContext(NavigationContext);
  const [selectedWorklog, setSelectedWorklog] = useState<WorklogCompact>({
    id: '',
    issueKey: '',
    issueSummary: '',
    started: '',
    timeSpent: 0,
  });
  const [timeValue, setTimeValue] = useState('0:30');
  const [descriptionValue, setDescriptionValue] = useState(
    'Dui molestie fermentum bibendum etiam tellus curabitur purus proin.'
  );

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
      <EditWorklogHeader onCancelPress={() => setCurrentWorklogToEdit(null)} onSavePress={() => {}} />
      <View style={styles.container}>
        <CustomTextInput
          isVisible={!!currentWorklogToEdit}
          value={timeValue}
          onChangeText={setTimeValue}
          style={styles.timeInput}
        />
        <CustomTextInput
          isVisible={!!currentWorklogToEdit}
          value={descriptionValue}
          onChangeText={setDescriptionValue}
          style={styles.descriptionInput}
          multiline
          numberOfLines={4}
        />
      </View>
      <EditWorklogFooter onDeletePress={() => {}} />
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
  timeInput: {
    width: 90,
    height: 42,
    fontSize: 20,
    lineHeight: 26,
  },
  descriptionInput: {
    width: '100%',
    height: 100,
  },
});
