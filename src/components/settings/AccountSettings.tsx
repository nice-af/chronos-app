import { useAtom, useAtomValue } from 'jotai';
import React, { FC, Fragment, useMemo, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { loginsAtom, themeAtom } from '../../atoms';
import { useTranslation } from '../../services/i18n.service';
import { useAuthRequest } from '../../services/jira-auth.service';
import { getWorkspaceColor, useThemedStyles } from '../../services/theme.service';
import { createSettingsStyles } from '../../styles/settings';
import { Theme } from '../../styles/theme/theme-types';
import { typo } from '../../styles/typo';
import { getPadding } from '../../styles/utils';
import { LoginModel, UUID } from '../../types/accounts.types';
import { ButtonSecondary } from '../ButtonSecondary';
import { LoadingSpinnerSmall } from '../LoadingSpinnerSmall';
import { AccountSettingsOptions } from './AccountSettingsOptions';

interface AccountRowProps {
  login: LoginModel;
  isPrimary: boolean;
  showPrimaryButton: boolean;
  onSetPrimary: () => void;
}

const AccountRow: FC<AccountRowProps> = ({ login, isPrimary, showPrimaryButton, onSetPrimary }) => {
  const { name, avatarUrl, workspaceDisplayName } = login;
  const styles = useThemedStyles(createStyles);
  const { type: themeType } = useAtomValue(themeAtom);
  const [showSettings, setShowSettings] = useState(false);
  const theme = useAtomValue(themeAtom);

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
            <View style={styles.workspaceNameContainer}>
              <View style={[styles.workspaceColorIndicator, { backgroundColor: getWorkspaceColor(login, theme) }]} />
              <Text numberOfLines={1} lineBreakMode='clip' style={styles.workspaceName}>
                {workspaceDisplayName}
              </Text>
            </View>
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
          iconRight={
            <View style={{ pointerEvents: 'none' }}>
              {showSettings && <Image source={chevronIcon} />}
              {!showSettings && <Image source={settingsIcon} />}
            </View>
          }
          onPress={() => setShowSettings(!showSettings)}
          style={{ ...getPadding(6), width: 32, height: 32 }}
        />
      </View>
      {showSettings && <AccountSettingsOptions login={login} />}
    </View>
  );
};

export const AccountSettings: FC = () => {
  const [logins, setLogins] = useAtom(loginsAtom);
  const styles = useThemedStyles(createStyles);
  const settingsStyles = useThemedStyles(createSettingsStyles);
  const { t } = useTranslation();
  const { initOAuth, isLoading } = useAuthRequest();
  const [primaryAccountUUID, setPrimaryAccountUUID] = useState(logins.find(jiraAccount => jiraAccount.isPrimary)?.uuid);

  function handleSetPrimary(uuid: UUID) {
    setPrimaryAccountUUID(uuid);
    setLogins(
      logins
        .map(jiraAccount => ({ ...jiraAccount, isPrimary: jiraAccount.uuid === uuid }))
        .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary))
    );
  }

  return (
    <View style={settingsStyles.card}>
      <Text style={[settingsStyles.headline, { marginBottom: 4 }]}>{t('account.settingsTitle')}</Text>
      <View style={settingsStyles.hr} />
      {logins.map(login => (
        <Fragment key={login.uuid}>
          <AccountRow
            isPrimary={primaryAccountUUID === login.uuid}
            onSetPrimary={() => handleSetPrimary(login.uuid)}
            showPrimaryButton={logins.length > 1}
            login={login}
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
    workspaceNameContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    workspaceColorIndicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
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
