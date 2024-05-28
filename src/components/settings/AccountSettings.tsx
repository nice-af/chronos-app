import { useAtom, useAtomValue } from 'jotai';
import React, { FC, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { jiraAccountsAtom, logout, themeAtom } from '../../atoms';
import { useTranslation } from '../../services/i18n.service';
import { useAuthRequest } from '../../services/jira-auth.service';
import { useModal } from '../../services/modal.service';
import { JiraAccountModel } from '../../services/storage.service';
import { useThemedStyles } from '../../services/theme.service';
import { createSettingsStyles } from '../../styles/settings';
import { Theme } from '../../styles/theme/theme-types';
import { typo } from '../../styles/typo';
import { getPadding } from '../../styles/utils';
import { ButtonDanger } from '../ButtonDanger';
import { ButtonSecondary } from '../ButtonSecondary';
import { LoadingSpinnerSmall } from '../LoadingSpinnerSmall';

interface AccountRowProps {
  jiraAccount: JiraAccountModel;
  isPrimary: boolean;
  showPrimaryButton: boolean;
  onSetPrimary: () => void;
}

const AccountRow: FC<AccountRowProps> = ({
  jiraAccount: { accountId, name, avatarUrl, workspaceName },
  isPrimary,
  showPrimaryButton,
  onSetPrimary,
}) => {
  const styles = useThemedStyles(createStyles);
  const { type: themeType } = useAtomValue(themeAtom);
  const { t } = useTranslation();
  const { getModalConfirmation } = useModal();

  async function handleLogout() {
    const confirmed = await getModalConfirmation({
      icon: 'account-warning',
      headline: t('modals.accountLogoutHeadline'),
      text: t('modals.accountLogoutText'),
    });
    if (confirmed) {
      logout(accountId);
    }
  }

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
        {name && (
          <Text numberOfLines={1} lineBreakMode='clip' style={styles.username}>
            {name}
          </Text>
        )}
        {workspaceName && (
          <Text numberOfLines={1} lineBreakMode='clip' style={styles.workspaceName}>
            {workspaceName}
          </Text>
        )}
      </View>
      {showPrimaryButton && (
        <ButtonSecondary
          iconRight={<Image source={isPrimary ? starFilledIcon : starEmptyIcon} />}
          onPress={onSetPrimary}
          style={{ ...getPadding(6) }}
        />
      )}
      <ButtonDanger label={t('account.logOut')} onPress={handleLogout} />
    </View>
  );
};

export const AccountSettings: FC = () => {
  const [jiraAccounts, setJiraAccounts] = useAtom(jiraAccountsAtom);
  const styles = useThemedStyles(createStyles);
  const settingsStyles = useThemedStyles(createSettingsStyles);
  const { t } = useTranslation();
  const { initOAuth, isLoading } = useAuthRequest();
  const [primaryAccountIndex, setPrimaryAccountIndex] = useState(
    jiraAccounts.find(jiraAccount => jiraAccount.isPrimary)?.accountId
  );

  function handleSetPrimary(accountId: string) {
    setPrimaryAccountIndex(accountId);
    setJiraAccounts(
      jiraAccounts.map(jiraAccount => ({ ...jiraAccount, isPrimary: jiraAccount.accountId === accountId }))
    );
  }

  return (
    <View style={settingsStyles.card}>
      <Text style={settingsStyles.headline}>{t('account.settingsTitle')}</Text>
      {jiraAccounts.map(jiraAccount => (
        <AccountRow
          key={jiraAccount.accountId}
          isPrimary={primaryAccountIndex === jiraAccount.accountId}
          onSetPrimary={() => handleSetPrimary(jiraAccount.accountId)}
          showPrimaryButton={jiraAccounts.length > 1}
          jiraAccount={jiraAccount}
        />
      ))}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <LoadingSpinnerSmall />
          <Text style={styles.loadingText}>{t('account.addingNewAccount')}</Text>
        </View>
      ) : (
        <View style={styles.buttonContainer}>
          <ButtonSecondary label={t('account.addNewAccount')} onPress={initOAuth} />
        </View>
      )}
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
    loadingContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginTop: 14,
      marginBottom: 4,
    },
    loadingText: {
      ...typo.body,
      color: theme.textPrimary,
    },
  });
}
