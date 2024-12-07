import { useAtomValue, useSetAtom } from 'jotai';
import React, { FC, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { currentOverlayAtom, currentWorklogToEditAtom, deleteWorklog, themeAtom, updateWorklog } from '../atoms';
import { CustomTextInput } from '../components/CustomTextInput';
import { EditWorklogHeader } from '../components/EditWorklogHeader';
import { IssueKeyTag } from '../components/IssueKeyTag';
import { Layout } from '../components/Layout';
import { formatSecondsToHMM, parseDurationStringToSeconds } from '../services/time.service';
import { typo } from '../styles/typo';
import { useTranslation } from '../services/i18n.service';

export const EditWorklog: FC = () => {
  const currentWorklogToEdit = useAtomValue(currentWorklogToEditAtom);
  const setCurrentOverlay = useSetAtom(currentOverlayAtom);
  const [timeSpentInputValue, setTimeSpentInputValue] = useState(
    formatSecondsToHMM(currentWorklogToEdit?.timeSpentSeconds ?? 0)
  );
  const [descriptionValue, setDescriptionValue] = useState(currentWorklogToEdit?.comment ?? '');
  const theme = useAtomValue(themeAtom);
  const { t } = useTranslation();

  useEffect(() => {
    if (currentWorklogToEdit) {
      setTimeSpentInputValue(formatSecondsToHMM(currentWorklogToEdit.timeSpentSeconds));
      setDescriptionValue(currentWorklogToEdit.comment);
    }
  }, [currentWorklogToEdit]);

  if (!currentWorklogToEdit) {
    return null;
  }

  function handleOnSaveClick() {
    // TODO @florianmrz use `immer` or similar
    const newWorklog = JSON.parse(JSON.stringify(currentWorklogToEdit)) as typeof currentWorklogToEdit;
    const parsed = parseDurationStringToSeconds(timeSpentInputValue);
    setCurrentOverlay(null);

    if (!newWorklog) {
      return;
    }
    if (parsed !== null) {
      newWorklog.timeSpentSeconds = parsed;
    }
    newWorklog.comment = descriptionValue;

    if (JSON.stringify(newWorklog) !== JSON.stringify(currentWorklogToEdit)) {
      updateWorklog(newWorklog);
    }
  }

  function handleOnDeleteClick() {
    if (currentWorklogToEdit) {
      void deleteWorklog(currentWorklogToEdit.id);
    }
    setCurrentOverlay(null);
  }

  function cleanupInputValue() {
    const parsed = parseDurationStringToSeconds(timeSpentInputValue);
    setTimeSpentInputValue(formatSecondsToHMM(parsed));
  }

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
          label={t('duration')}
          isVisible={!!currentWorklogToEdit}
          value={timeSpentInputValue}
          onChangeText={newText => setTimeSpentInputValue(newText)}
          onBlur={cleanupInputValue}
          style={styles.timeInput}
          inputContainerStyle={styles.timeInputContainer}
        />
        <CustomTextInput
          label={t('description')}
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
  timeInputContainer: {
    width: 90,
    height: 42,
  },
  timeInput: {
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
