import { useAtomValue } from 'jotai';
import React, { FC, useMemo, useState } from 'react';
import { Image, ImageSourcePropType, Pressable, StyleSheet, Text, View } from 'react-native';
import { themeAtom } from '../../atoms';
import { modalAccountSelectionDataAtom, modalAccountSelectionVisibleAtom } from '../../atoms/modals';
import { useTranslation } from '../../services/i18n.service';
import { useThemedStyles } from '../../services/theme.service';
import { Theme } from '../../styles/theme/theme-types';
import { typo } from '../../styles/typo';
import { getPadding } from '../../styles/utils';
import { CloudId } from '../../types/accounts.types';
import { JiraResource } from '../../types/jira.types';
import { ButtonSecondary } from '../ButtonSecondary';
import { WorkspaceLogo } from '../WorkspaceLogo';
import { ModalContainer } from './ModalContainer';

export const ModalAccountSelection: FC = () => {
  const data = useAtomValue(modalAccountSelectionDataAtom);
  const isVisible = useAtomValue(modalAccountSelectionVisibleAtom);
  const styles = useThemedStyles(createStyles);
  const theme = useAtomValue(themeAtom);
  const { t } = useTranslation();
  const { modalIcon, arrowIcon } = useMemo(
    () => ({
      modalIcon:
        theme.type === 'light'
          ? require('../../assets/modal-icons/account-add-light.png')
          : require('../../assets/modal-icons/account-add-dark.png'),
      arrowIcon:
        theme.type === 'light'
          ? require('../../assets/icons/arrow-right-light.png')
          : require('../../assets/icons/arrow-right-dark.png'),
    }),
    [theme.type]
  );

  if (!data) {
    return null;
  }

  return (
    <ModalContainer isVisible={isVisible}>
      {modalIcon && <Image style={styles.icon} source={modalIcon} />}
      <Text style={styles.headline}>{t('account.whichAccountToAdd')}</Text>
      <View style={styles.pressableContainer}>
        {data.jiraResources.map(resource => (
          <AccountButton key={resource.url} onPress={data.onConfirm} arrowIcon={arrowIcon} resource={resource} />
        ))}
      </View>
      <View style={styles.buttonsContainer}>
        <ButtonSecondary
          label={t('modals.cancel')}
          onPress={data.onCancel}
          style={{ flexBasis: 100, flexGrow: 1, paddingLeft: 10, paddingRight: 10 }}
        />
      </View>
    </ModalContainer>
  );
};

interface AccountButtonProps {
  onPress: (cloudId: CloudId) => void;
  arrowIcon: ImageSourcePropType;
  resource: JiraResource;
}

export const AccountButton: FC<AccountButtonProps> = ({ onPress, arrowIcon, resource }) => {
  const [isHovered, setIsHovered] = useState(false);
  const styles = useThemedStyles(createStyles);

  return (
    <Pressable
      onPress={() => onPress(resource.id as CloudId)}
      style={[styles.pressable, isHovered && styles.pressableHovered]}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}>
      <View style={styles.labelContainer}>
        <WorkspaceLogo
          size={32}
          workspaceUrl={resource.url}
          workspaceAvatarUrl={resource.avatarUrl ?? ''}
          logoVariant='navbarLogo'
          borderRadius={6}
        />
        <Text lineBreakMode='clip' numberOfLines={1} style={styles.label}>
          {resource.name.charAt(0).toUpperCase() + resource.name.slice(1)}
        </Text>
      </View>
      <Image style={styles.arrowIcon} source={arrowIcon} />
    </Pressable>
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
    pressableContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      gap: 10,
    },
    pressable: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      alignSelf: 'center',
      flexDirection: 'row',
      gap: 8,
      width: 240,
      backgroundColor: theme.secondaryButtonBase,
      borderColor: theme.secondaryButtonBorder,
      borderWidth: 1,
      borderRadius: theme.buttonBorderRadius,
      ...getPadding(7, 12),
    },
    pressableHovered: {
      backgroundColor: theme.secondaryButtonHover,
    },
    labelContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    label: {
      ...typo.bodyEmphasized,
      color: theme.textPrimary,
      maxWidth: 152,
    },
    arrowIcon: {
      width: 16,
      height: 16,
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
