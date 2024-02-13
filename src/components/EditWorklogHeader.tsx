import React, { FC } from 'react';
import { ImageBackground, Platform, StyleSheet, Text, View } from 'react-native';
import { useThemedStyles } from '../services/theme.service';
import { Theme } from '../styles/theme/theme-types';
import { typo } from '../styles/typo';
import { getPadding } from '../styles/utils';
import { ButtonPrimary } from './ButtonPrimary';
import { ButtonSecondary } from './ButtonSecondary';

interface EditWorklogHeaderProps {
  onCancelPress: () => void;
  onSavePress: () => void;
}

export const EditWorklogHeader: FC<EditWorklogHeaderProps> = ({ onCancelPress, onSavePress }) => {
  const styles = useThemedStyles(createStyles);

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

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      position: 'relative',
      height: 49,
      overflow: 'hidden',
      backgroundColor: theme.backgroundDark,
      ...Platform.select({
        default: {
          borderColor: theme.borderSolid,
          borderBottomWidth: 1,
        },
      }),
    },
    content: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 48,
      ...getPadding(0, 16),
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
      color: theme.textPrimary,
      flexShrink: 0,
      marginTop: 2,
    },
    buttonsContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 8,
    },
  });
}
