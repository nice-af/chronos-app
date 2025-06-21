import { useAtomValue } from 'jotai';
import React, { FC, useState } from 'react';
import { Image, ImageBackground, Platform, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { themeAtom } from '../atoms';
import { useTranslation } from '../services/i18n.service';
import { useThemedStyles } from '../services/theme.service';
import { Theme } from '../styles/theme/theme-types';
import { typo } from '../styles/typo';
import { getPadding } from '../styles/utils';
import { ButtonDanger } from './ButtonDanger';
import { ButtonPrimary } from './ButtonPrimary';
import { ButtonSecondary } from './ButtonSecondary';

interface EditWorklogHeaderProps {
  onCancelPress: () => void;
  onSavePress: () => void;
  onDeletePress: () => void;
}

export const EditWorklogHeader: FC<EditWorklogHeaderProps> = ({ onCancelPress, onSavePress, onDeletePress }) => {
  const styles = useThemedStyles(createStyles);
  const [showOther, setShowOther] = useState(false);
  const theme = useAtomValue(themeAtom);
  const { t } = useTranslation();
  const isCramped = useWindowDimensions().width < 500;

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/edit-stripes-bg.png')} resizeMode='repeat' style={styles.stripesBg} />
      <View style={[styles.content, showOther && { justifyContent: 'flex-end' }]}>
        {!(showOther && isCramped) && (
          <Text style={styles.title} numberOfLines={1}>
            {t('worklogs.editWorklog')}
          </Text>
        )}
        <View style={styles.buttonsContainer}>
          {showOther && <ButtonDanger label={t('delete')} onPress={onDeletePress} />}
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
          <ButtonSecondary label={t('cancel')} onPress={onCancelPress} />
          <ButtonPrimary label={t('save')} onPress={onSavePress} />
        </View>
      </View>
    </View>
  );
};

function createStyles(theme: Theme) {
  // This needs to be assigned to `styles` for react-native/no-unused-styles to work
  const styles = StyleSheet.create({
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
      gap: 10,
      ...getPadding(0, 16),
    },
    stripesBg: {
      position: 'absolute',
      left: 0,
      width: '100%',
      height: 48,
      opacity: theme.type === 'light' ? 0.75 : 1,
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
      flexShrink: 1,
      flexGrow: 1,
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
  return styles;
}
