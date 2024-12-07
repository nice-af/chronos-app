import { useAtomValue } from 'jotai';
import { transparentize } from 'polished';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { themeAtom } from '../../atoms';
import { useTranslation } from '../../services/i18n.service';
import { StorageKey, getFromStorage, setInStorage } from '../../services/storage.service';
import { useThemedStyles } from '../../services/theme.service';
import { Theme } from '../../styles/theme/theme-types';
import { typo } from '../../styles/typo';
import { getPadding } from '../../styles/utils';
import { ButtonTransparent } from '../ButtonTransparent';
import { ModalContainer } from './ModalContainer';

export const ModalNewFeatures: FC = () => {
  const currentVersion = 'v0.1.15';
  const [isVisible, setIsVisible] = useState(false);
  const styles = useThemedStyles(createStyles);
  const theme = useAtomValue(themeAtom);
  const { t } = useTranslation();
  const { crossIcon, featureImage } = useMemo(
    () => ({
      crossIcon:
        theme.type === 'light'
          ? require('../../assets/icons/cross-light.png')
          : require('../../assets/icons/cross-dark.png'),
      featureImage:
        theme.type === 'light'
          ? require('../../assets/features-15-light.png')
          : require('../../assets/features-15-dark.png'),
    }),
    [theme.type]
  );

  useEffect(() => {
    void (async () => {
      const lastVersion = await getFromStorage(StorageKey.LAST_VERSION);
      if (lastVersion !== currentVersion) {
        setIsVisible(true);
        await setInStorage(StorageKey.LAST_VERSION, currentVersion);
      }
    })();
  }, []);

  function handlePress() {
    setIsVisible(false);
    void setInStorage(StorageKey.LAST_VERSION, currentVersion);
  }

  return (
    <ModalContainer isVisible={isVisible}>
      <ButtonTransparent style={styles.closeBtn} onPress={handlePress}>
        <Image source={crossIcon} width={16} height={16} />
      </ButtonTransparent>
      <View style={styles.pill}>
        <Text style={styles.pillText}>{t('newFeaturesModal.pillText')}</Text>
      </View>
      <Text style={styles.headline}>{t('newFeaturesModal.headline')}</Text>
      <Text style={styles.body}>{t('newFeaturesModal.body1')}</Text>
      <Text style={styles.body}>{t('newFeaturesModal.body2')}</Text>
      <Image style={styles.image} source={featureImage} />
    </ModalContainer>
  );
};

function createStyles(theme: Theme) {
  // This needs to be assigned to `styles` for react-native/no-unused-styles to work
  const styles = StyleSheet.create({
    closeBtn: {
      position: 'absolute',
      top: 10,
      right: 10,
      zIndex: 2,
    },
    pill: {
      ...getPadding(3, 10),
      borderRadius: 999,
      backgroundColor: transparentize(0.5, theme.blue as string),
      alignSelf: 'center',
      marginTop: 10,
      marginBottom: 16,
    },
    pillText: {
      ...typo.calloutEmphasized,
    },
    headline: {
      ...typo.title2Emphasized,
      color: theme.textPrimary,
      marginBottom: 12,
      textAlign: 'center',
    },
    body: {
      ...typo.body,
      color: theme.textSecondary,
      textAlign: 'center',
      marginBottom: 8,
    },
    image: {
      width: 330,
      height: 120,
      left: -20,
      bottom: -16,
      marginTop: 8,
    },
  });
  return styles;
}
