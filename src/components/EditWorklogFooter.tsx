import React, { FC, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { getPadding } from '../styles/utils';
import { ButtonDanger } from './ButtonDanger';
import { ButtonSecondary } from './ButtonSecondary';

interface EditWorklogFooterProps {
  onDeletePress: () => void;
}

export const EditWorklogFooter: FC<EditWorklogFooterProps> = ({ onDeletePress }) => {
  const [showDelete, setShowDelete] = useState(false);
  return (
    <View style={styles.container}>
      {showDelete && <ButtonDanger label='Yes, delete this' onPress={onDeletePress} />}
      {!showDelete && <ButtonSecondary label='Delete' onPress={() => setShowDelete(true)} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'stretch',
    position: 'relative',
    width: '100%',
    height: 49,
    ...getPadding(8, 16),
    overflow: 'hidden',
  },
});
