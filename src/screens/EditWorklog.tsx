import { useAtomValue, useSetAtom } from 'jotai';
import React, { FC, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { currentOverlayAtom, currentWorklogToEditAtom, themeAtom, updateWorklog } from '../atoms';
import { CustomTextInput } from '../components/CustomTextInput';
import { EditWorklogHeader } from '../components/EditWorklogHeader';
import { IssueKeyTag } from '../components/IssueKeyTag';
import { Layout } from '../components/Layout';
import { formatSecondsToHMM, parseDurationStringToSeconds } from '../services/time.service';
import { typo } from '../styles/typo';

export const EditWorklog: FC = () => {
  const currentWorklogToEdit = useAtomValue(currentWorklogToEditAtom);
  const setCurrentOverlay = useSetAtom(currentOverlayAtom);
  const [timeSpentInputValue, setTimeSpentInputValue] = useState(
    formatSecondsToHMM(currentWorklogToEdit?.timeSpentSeconds ?? 0)
  );
  const [descriptionValue, setDescriptionValue] = useState(currentWorklogToEdit?.comment ?? '');
  const theme = useAtomValue(themeAtom);

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
    const parsed = parseDurationStringToSeconds(timeSpentInputValue);
    if (parsed !== null) {
      newWorklog.timeSpentSeconds = parsed;
    }
    newWorklog.comment = descriptionValue;

    if (JSON.stringify(newWorklog) !== JSON.stringify(currentWorklogToEdit)) {
      updateWorklog(newWorklog);
    }
    setCurrentOverlay(null);
  };

  const handleOnDeleteClick = async () => {
    await deleteWorklog(currentWorklogToEdit.id);
    setCurrentOverlay(null);
  };

  const cleanupInputValue = () => {
    const parsed = parseDurationStringToSeconds(timeSpentInputValue);
    setTimeSpentInputValue(formatSecondsToHMM(parsed, true));
  };

  return (
    <Layout
      customBackgroundColor={theme.backgroundDrawer}
      header={{
        align: 'left',
        title: (
          <View style={styles.headerContainer}>
            <IssueKeyTag issueKey={currentWorklogToEdit.issue.key} uuid={currentWorklogToEdit.uuid} />
            <Text numberOfLines={1} style={styles.title}>
              {currentWorklogToEdit.issue.summary}
            </Text>
          </View>
        ),
        onBackPress: () => setCurrentOverlay(null),
      }}>
      <EditWorklogHeader
        onCancelPress={() => setCurrentOverlay(null)}
        onSavePress={() => handleOnSaveClick()}
        onDeletePress={() => handleOnDeleteClick()}
      />
      <View style={styles.container}>
        <CustomTextInput
          isVisible={!!currentWorklogToEdit}
          value={timeSpentInputValue}
          onChangeText={newText => setTimeSpentInputValue(newText)}
          onBlur={cleanupInputValue}
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
    lineHeight: 24,
    paddingLeft: 0,
    paddingRight: 0,
    textAlign: 'center',
  },
  descriptionInput: {
    width: '100%',
    height: 100,
  },
});
function deleteWorklog(id: string) {
  throw new Error('Function not implemented.');
}
