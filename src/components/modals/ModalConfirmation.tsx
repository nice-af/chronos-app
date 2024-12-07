import { useAtomValue } from 'jotai';
import React, { FC, useMemo } from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';
import { themeAtom } from '../../atoms';
import { modalConfirmationDataAtom, modalConfirmationVisibleAtom } from '../../atoms/modals';
import { useTranslation } from '../../services/i18n.service';
import { useThemedStyles } from '../../services/theme.service';
import { Theme } from '../../styles/theme/theme-types';
import { typo } from '../../styles/typo';
import { ButtonPrimary } from '../ButtonPrimary';
import { ButtonSecondary } from '../ButtonSecondary';
import { ModalContainer } from './ModalContainer';

export const ModalConfirmation: FC = () => {
  const data = useAtomValue(modalConfirmationDataAtom);
  const isVisible = useAtomValue(modalConfirmationVisibleAtom);
  const styles = useThemedStyles(createStyles);
  const theme = useAtomValue(themeAtom);
  const { t } = useTranslation();
  const iconSource = useMemo<ImageSourcePropType | undefined>(() => {
    if (!data) {
      return undefined;
    }
    if (data.icon === 'timer-warning') {
      return theme.type === 'light'
        ? (require('../../assets/modal-icons/timer-warning-light.png') as ImageSourcePropType)
        : (require('../../assets/modal-icons/timer-warning-dark.png') as ImageSourcePropType);
    } else if (data.icon === 'account-warning') {
      return theme.type === 'light'
        ? (require('../../assets/modal-icons/account-warning-light.png') as ImageSourcePropType)
        : (require('../../assets/modal-icons/account-warning-dark.png') as ImageSourcePropType);
    } else if (data.icon === 'recover-worklogs') {
      return theme.type === 'light'
        ? (require('../../assets/modal-icons/recover-worklogs-light.png') as ImageSourcePropType)
        : (require('../../assets/modal-icons/recover-worklogs-dark.png') as ImageSourcePropType);
    }
  }, [data?.icon, theme.type]);

  if (!data) {
    return null;
  }

  return (
    <ModalContainer isVisible={isVisible}>
      {iconSource && <Image style={styles.icon} source={iconSource} />}
      <Text style={styles.headline}>{data.headline}</Text>
      <Text style={styles.text}>{data.text}</Text>
      <View style={styles.buttonsContainer}>
        <ButtonSecondary
          label={data.cancelButtonLabel ?? t('modals.cancel')}
          onPress={data.onCancel}
          style={{ flexBasis: 100, flexGrow: 1, paddingLeft: 10, paddingRight: 10 }}
        />
        <ButtonPrimary
          label={data.confirmButtonLabel ?? t('modals.continue')}
          onPress={data.onConfirm}
          style={{ flexBasis: 100, flexGrow: 1, paddingLeft: 10, paddingRight: 10 }}
        />
      </View>
    </ModalContainer>
  );
};

function createStyles(theme: Theme) {
  // This needs to be assigned to `styles` for react-native/no-unused-styles to work
  const styles = StyleSheet.create({
    icon: {
      width: 48,
      height: 48,
      alignSelf: 'center',
      marginBottom: 20,
    },
    headline: {
      ...typo.bodyEmphasized,
      color: theme.textPrimary,
      marginBottom: 8,
      textAlign: 'center',
    },
    text: {
      ...typo.body,
      color: theme.textSecondary,
      textAlign: 'center',
    },
    buttonsContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 10,
      marginTop: 24,
    },
  });
  return styles;
}
