import React from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { colors } from '../styles/colors';
import { typo } from '../styles/typo';
import { getPadding } from '../styles/utils';
import { ButtonPrimary } from './ButtonPrimary';
import { ButtonSecondary } from './ButtonSecondary';

interface EditWorklogHeaderProps {
  onCancelPress: () => void;
  onSavePress: () => void;
}

export const EditWorklogHeader: React.FC<EditWorklogHeaderProps> = ({ onCancelPress, onSavePress }) => {
  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/edit-stripes-bg.png')} resizeMode='repeat' style={styles.stripesBg} />
      <View style={styles.content}>
        <Text style={styles.title}>Edit worklog</Text>
        <View style={styles.buttonsContainer}>
          <ButtonSecondary label='Cancel' onPress={onCancelPress} />
          <ButtonPrimary label='Save' onPress={onSavePress} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    height: 49,
    overflow: 'hidden',
    backgroundColor: colors.backgroundDark,
    borderBottomColor: colors.borderSolid,
    borderBottomWidth: 1,
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    whiteSpace: 'nowrap',
    width: '100%',
    height: 48,
    ...getPadding(0, 10),
  },
  stripesBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 48,
  },
  title: {
    ...typo.headline,
    flex: 1,
    marginLeft: 8,
    marginTop: 2,
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
