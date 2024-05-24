import { useAtomValue, useSetAtom } from 'jotai';
import React, { FC } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { jiraAuthAtom, logoutAtom, userInfoAtom } from '../../atoms';
import { useTranslation } from '../../services/i18n.service';
import { useThemedStyles } from '../../services/theme.service';
import { createSettingsStyles } from '../../styles/settings';
import { Theme } from '../../styles/theme/theme-types';
import { typo } from '../../styles/typo';
import { ButtonDanger } from '../ButtonDanger';

export const AccountSettings: FC = () => {
  const logout = useSetAtom(logoutAtom);
  const userInfo = useAtomValue(userInfoAtom);
  const workspaceName = useAtomValue(jiraAuthAtom)?.workspaceName;
  const avatarUrl = userInfo?.avatarUrls?.['48x48'];
  const styles = useThemedStyles(createStyles);
  const settingsStyles = useThemedStyles(createSettingsStyles);
  const { t } = useTranslation();

  return (
    <View style={settingsStyles.card}>
      <Text style={settingsStyles.headline}>{t('account.settingsTitle')}</Text>
      <View style={styles.rowContainer}>
        <Image source={{ uri: avatarUrl, width: 48, height: 48 }} style={styles.avatar} />
        <View style={styles.accountInfo}>
          <Text numberOfLines={1} lineBreakMode='clip' style={styles.username}>
            {userInfo?.displayName}
          </Text>
          {workspaceName && (
            <Text numberOfLines={1} lineBreakMode='clip' style={styles.workspaceName}>
              {workspaceName}
            </Text>
          )}
        </View>
        <ButtonDanger label={t('account.logOut')} onPress={logout} />
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
  });
}
