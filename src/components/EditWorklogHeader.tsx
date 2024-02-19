import React, { FC, useContext, useState } from 'react';
import { Image, ImageBackground, Platform, StyleSheet, Text, View } from 'react-native';
import { useThemedStyles } from '../services/theme.service';
import { Theme } from '../styles/theme/theme-types';
import { typo } from '../styles/typo';
import { getPadding } from '../styles/utils';
import { ButtonPrimary } from './ButtonPrimary';
import { ButtonSecondary } from './ButtonSecondary';
import { useAtomValue } from 'jotai';
import { themeAtom } from '../atoms';
import { ButtonDanger } from './ButtonDanger';

interface EditWorklogHeaderProps {
  onCancelPress: () => void;
  onSavePress: () => void;
  onDeletePress: () => void;
}

export const EditWorklogHeader: FC<EditWorklogHeaderProps> = ({ onCancelPress, onSavePress, onDeletePress }) => {
  const styles = useThemedStyles(createStyles);
  const [showOther, setShowOther] = useState(false);
  const theme = useAtomValue(themeAtom);

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/edit-stripes-bg.png')} resizeMode='repeat' style={styles.stripesBg} />
      <View style={[styles.content, showOther && { justifyContent: 'flex-end' }]}>
        {!showOther && <Text style={styles.title}>Edit worklog</Text>}
        <View style={styles.buttonsContainer}>
          {showOther && <ButtonDanger label='Delete' onPress={onDeletePress} />}
          {!showOther && (
            <ButtonSecondary
              iconRight={
                <Image
                  style={styles.dotsIcon}
                  source={
                    theme.type === 'light'
                      ? require('../assets/icons/dots-light.png')
                      : require('../assets/icons/dots-dark.png')
                  }
                />
              }
              onPress={() => setShowOther(true)}
            />
          )}
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
        windows: {
          height: 50,
          borderBottomWidth: 0,
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
      left: 0,
      width: '100%',
      height: 48,
      ...Platform.select({
        default: {
          top: 0,
        },
        windows: {
          top: 1,
        },
      }),
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
    dotsIcon: {
      width: 16,
      height: 16,
    },
  });
}
