import { useAtomValue, useSetAtom } from 'jotai';
import React, { FC, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { jiraAuthAtom, logoutAtom, themeAtom, userInfoAtom } from '../../atoms';
import { useTranslation } from '../../services/i18n.service';
import { useThemedStyles } from '../../services/theme.service';
import { createSettingsStyles } from '../../styles/settings';
import { Theme } from '../../styles/theme/theme-types';
import { typo } from '../../styles/typo';
import { ButtonDanger } from '../ButtonDanger';
import { ButtonSecondary } from '../ButtonSecondary';
import { getPadding } from '../../styles/utils';

interface AccountRowProps {
  avatarUrl?: string;
  accountName?: string;
  workspaceName?: string;
  isPrimary: boolean;
  onSetPrimary: () => void;
}

const AccountRow: FC<AccountRowProps> = ({ avatarUrl, accountName, workspaceName, isPrimary, onSetPrimary }) => {
  const logout = useSetAtom(logoutAtom);
  const styles = useThemedStyles(createStyles);
  const { type: themeType } = useAtomValue(themeAtom);
  const { t } = useTranslation();

  const starEmptyIcon =
    themeType === 'dark'
      ? require('../../assets/icons/star-empty-dark.png')
      : require('../../assets/icons/star-empty-light.png');
  const starFilledIcon =
    themeType === 'dark'
      ? require('../../assets/icons/star-filled-dark.png')
      : require('../../assets/icons/star-filled-light.png');

  return (
    <View style={styles.rowContainer}>
      <Image source={{ uri: avatarUrl, width: 48, height: 48 }} style={styles.avatar} />
      <View style={styles.accountInfo}>
        {accountName && (
          <Text numberOfLines={1} lineBreakMode='clip' style={styles.username}>
            {accountName}
          </Text>
        )}
        {workspaceName && (
          <Text numberOfLines={1} lineBreakMode='clip' style={styles.workspaceName}>
            {workspaceName}
          </Text>
        )}
      </View>
      <ButtonSecondary
        iconRight={<Image source={isPrimary ? starFilledIcon : starEmptyIcon} />}
        onPress={onSetPrimary}
        style={{ ...getPadding(6) }}
      />
      <ButtonDanger label={t('account.logOut')} onPress={logout} />
    </View>
  );
};

export const AccountSettings: FC = () => {
  const userInfo = useAtomValue(userInfoAtom);
  const workspaceName = useAtomValue(jiraAuthAtom)?.workspaceName;
  const avatarUrl = userInfo?.avatarUrls?.['48x48'];
  const styles = useThemedStyles(createStyles);
  const settingsStyles = useThemedStyles(createSettingsStyles);
  const { t } = useTranslation();
  const [primaryAccountIndex, setPrimaryAccountIndex] = useState(0);

  return (
    <View style={settingsStyles.card}>
      <Text style={settingsStyles.headline}>{t('account.settingsTitle')}</Text>
      <AccountRow
        isPrimary={primaryAccountIndex === 0}
        onSetPrimary={() => setPrimaryAccountIndex(0)}
        avatarUrl={avatarUrl}
        accountName={userInfo?.displayName}
        workspaceName={workspaceName}
      />
      <AccountRow
        isPrimary={primaryAccountIndex === 1}
        onSetPrimary={() => setPrimaryAccountIndex(1)}
        avatarUrl={avatarUrl}
        accountName={userInfo?.displayName}
        workspaceName={workspaceName}
      />
      <View style={styles.buttonContainer}>
        <ButtonSecondary label={t('account.addNewAccount')} onPress={() => {}} />
      </View>
    </View>
  );
};

function createStyles(theme: Theme) {
  return StyleSheet.create({
    rowContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
      width: '100%',
      marginBottom: 10,
    },
    accountInfo: {
      flexBasis: '100%',
      flexShrink: 1,
      flexGrow: 1,
    },
    username: {
      ...typo.calloutEmphasized,
      color: theme.textPrimary,
    },
    workspaceName: {
      ...typo.callout,
      color: theme.textSecondary,
    },
    avatar: {
      width: 24,
      height: 24,
      borderRadius: 12,
    },
    buttonContainer: {
      marginTop: 8,
    },
  });
}
