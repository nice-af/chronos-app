import { useAtom, useAtomValue } from 'jotai';
import React, { FC, Fragment, useMemo, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { jiraAccountsAtom, themeAtom } from '../../atoms';
import { useTranslation } from '../../services/i18n.service';
import { useAuthRequest } from '../../services/jira-auth.service';
import { JiraAccountModel } from '../../services/storage.service';
import { useThemedStyles } from '../../services/theme.service';
import { createSettingsStyles } from '../../styles/settings';
import { Theme } from '../../styles/theme/theme-types';
import { typo } from '../../styles/typo';
import { getPadding } from '../../styles/utils';
import { ButtonSecondary } from '../ButtonSecondary';
import { LoadingSpinnerSmall } from '../LoadingSpinnerSmall';
import { AccountSettingsOptions } from './AccountSettingsOptions';

interface AccountRowProps {
  jiraAccount: JiraAccountModel;
  isPrimary: boolean;
  showPrimaryButton: boolean;
  onSetPrimary: () => void;
}

const AccountRow: FC<AccountRowProps> = ({ jiraAccount, isPrimary, showPrimaryButton, onSetPrimary }) => {
  const { name, avatarUrl, workspaceDisplayName } = jiraAccount;
  const styles = useThemedStyles(createStyles);
  const { type: themeType } = useAtomValue(themeAtom);
  const [showSettings, setShowSettings] = useState(false);

  const { settingsIcon, chevronIcon, starEmptyIcon, starFilledIcon } = useMemo(
    () => ({
      settingsIcon:
        themeType === 'dark'
          ? require('../../assets/icons/slider-vertical-dark.png')
          : require('../../assets/icons/slider-vertical-light.png'),
      chevronIcon:
        themeType === 'dark'
          ? require('../../assets/icons/chevron-up-small-dark.png')
          : require('../../assets/icons/chevron-up-small-light.png'),
      starEmptyIcon:
        themeType === 'dark'
          ? require('../../assets/icons/star-empty-dark.png')
          : require('../../assets/icons/star-empty-light.png'),
      starFilledIcon:
        themeType === 'dark'
          ? require('../../assets/icons/star-filled-dark.png')
          : require('../../assets/icons/star-filled-light.png'),
    }),
    [themeType]
  );

  return (
    <View style={styles.rowContainer}>
      <View style={styles.accountInfosContainer}>
        <Image source={{ uri: avatarUrl, width: 48, height: 48 }} style={styles.avatar} />
        <View style={styles.accountInfo}>
          {name && (
            <Text numberOfLines={1} lineBreakMode='clip' style={styles.username}>
              {name}
            </Text>
          )}
          {workspaceDisplayName && (
            <Text numberOfLines={1} lineBreakMode='clip' style={styles.workspaceName}>
              {workspaceDisplayName}
            </Text>
          )}
        </View>
        {showPrimaryButton && (
          <ButtonSecondary
            iconRight={<Image source={isPrimary ? starFilledIcon : starEmptyIcon} />}
            onPress={onSetPrimary}
            style={{ ...getPadding(6), width: 32, height: 32 }}
          />
        )}
        <ButtonSecondary
          iconRight={<Image source={showSettings ? chevronIcon : settingsIcon} />}
          onPress={() => setShowSettings(!showSettings)}
          style={{ ...getPadding(6), width: 32, height: 32 }}
        />
      </View>
      {showSettings && <AccountSettingsOptions jiraAccount={jiraAccount} />}
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
      jiraAccounts
        .map(jiraAccount => ({ ...jiraAccount, isPrimary: jiraAccount.accountId === accountId }))
        .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary))
    );
  }

  return (
    <View style={settingsStyles.card}>
      <Text style={[settingsStyles.headline, { marginBottom: 4 }]}>{t('account.settingsTitle')}</Text>
      <View style={settingsStyles.hr} />
      {jiraAccounts.map(jiraAccount => (
        <Fragment key={jiraAccount.accountId}>
          <AccountRow
            isPrimary={primaryAccountIndex === jiraAccount.accountId}
            onSetPrimary={() => handleSetPrimary(jiraAccount.accountId)}
            showPrimaryButton={jiraAccounts.length > 1}
            jiraAccount={jiraAccount}
          />
          <View style={settingsStyles.hr} />
        </Fragment>
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
      marginTop: 2,
      marginBottom: 2,
    },
    accountInfosContainer: {
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
    buttonContainer: {
      marginTop: 4,
    },
    loadingContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginTop: 10,
      marginBottom: 4,
    },
    loadingText: {
      ...typo.body,
      color: theme.textPrimary,
    },
  });
}
