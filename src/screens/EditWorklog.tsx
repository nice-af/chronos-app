import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CustomTextInput } from '../components/CustomTextInput';
import { EditWorklogFooter } from '../components/EditWorklogFooter';
import { EditWorklogHeader } from '../components/EditWorklogHeader';
import { IssueTag } from '../components/IssueTag';
import { Layout } from '../components/Layout';
import { NavigationContext } from '../contexts/navigation.context';
import { ThemeContext } from '../contexts/theme.context';
import { WorklogContext } from '../contexts/worklog.context';
import { useThemedStyles } from '../services/theme.service';
import { formatSecondsToHMM, parseHMMToSeconds } from '../services/time.service';
import { Theme } from '../styles/theme/theme-types';
import { typo } from '../styles/typo';

export const EditWorklog: React.FC = () => {
  const { updateWorklog, deleteWorklog } = useContext(WorklogContext);
  const { currentWorklogToEdit, setCurrentWorklogToEdit } = useContext(NavigationContext);
  const [timeSpentInputValue, setTimeSpentInputValue] = useState(
    formatSecondsToHMM(currentWorklogToEdit?.timeSpentSeconds ?? 0)
  );
  const [descriptionValue, setDescriptionValue] = useState(currentWorklogToEdit?.comment ?? '');
  const { theme } = useContext(ThemeContext);
  const styles = useThemedStyles(createStyles);

  useEffect(() => {
    if (currentWorklogToEdit) {
      setTimeSpentInputValue(formatSecondsToHMM(currentWorklogToEdit.timeSpentSeconds));
      setDescriptionValue(currentWorklogToEdit.comment);
    }
  }, [currentWorklogToEdit]);

  if (!currentWorklogToEdit) {
    return null;
  }

  const handleOnSaveClick = async () => {
    // TODO @florianmrz use `immer` or similar
    const newWorklog = JSON.parse(JSON.stringify(currentWorklogToEdit));
    const parsed = parseHMMToSeconds(timeSpentInputValue);
    if (parsed !== null) {
      newWorklog.timeSpentSeconds = parsed;
    }
    newWorklog.comment = descriptionValue;

    if (JSON.stringify(newWorklog) !== JSON.stringify(currentWorklogToEdit)) {
      updateWorklog(newWorklog);
    }
    setCurrentWorklogToEdit(null);
  };

  const handleOnDeleteClick = async () => {
    await deleteWorklog(currentWorklogToEdit.id);
    setCurrentWorklogToEdit(null);
  };

  return (
    <Layout
      customBackgroundColor={theme.backgroundDrawer}
      header={{
        align: 'left',
        title: (
          <View style={styles.headerContainer}>
            <IssueTag label={currentWorklogToEdit.issue.key} project={'orcaya'} />
            <Text numberOfLines={1} style={styles.title}>
              {currentWorklogToEdit.issue.summary}
            </Text>
          </View>
        ),
        onBackPress: () => setCurrentWorklogToEdit(null),
      }}>
      <EditWorklogHeader onCancelPress={() => setCurrentWorklogToEdit(null)} onSavePress={() => handleOnSaveClick()} />
      <View style={styles.container}>
        <CustomTextInput
          isVisible={!!currentWorklogToEdit}
          value={timeSpentInputValue}
          onChangeText={newText => setTimeSpentInputValue(newText)}
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
      <EditWorklogFooter onDeletePress={() => handleOnDeleteClick()} />
    </Layout>
  );
};

function createStyles(theme: Theme) {
  return StyleSheet.create({
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
}
