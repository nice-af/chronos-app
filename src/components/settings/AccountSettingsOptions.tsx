import { useAtom } from 'jotai';
import React, { FC, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { loginsAtom, logout } from '../../atoms';
import { useTranslation } from '../../services/i18n.service';
import { useModal } from '../../services/modal.service';
import { useThemedStyles } from '../../services/theme.service';
import { ColorOption, Theme } from '../../styles/theme/theme-types';
import { typo } from '../../styles/typo';
import { LoginModel } from '../../types/accounts.types';
import { ButtonDanger } from '../ButtonDanger';
import { CustomTextInput } from '../CustomTextInput';
import { ColorSelector } from './ColorSelector';

interface AccountSettingsOptionsProps {
  login: LoginModel;
}

export const AccountSettingsOptions: FC<AccountSettingsOptionsProps> = ({ login }) => {
  const { uuid, accountId, workspaceDisplayName, workspaceColor, customWorkspaceColor } = login;
  const [jiraAccounts, setJiraAccounts] = useAtom(loginsAtom);
  const [customWorkspaceName, setCustomWorkspaceName] = useState(workspaceDisplayName);
  const [customWorkspaceColorValue, setCustomWorkspaceColorValue] = useState(customWorkspaceColor ?? '0B84FF');
  const styles = useThemedStyles(createStyles);
  const { t } = useTranslation();
  const { getModalConfirmation } = useModal();

  async function handleLogout() {
    const confirmed = await getModalConfirmation({
      icon: 'account-warning',
      headline: t('modals.accountLogoutHeadline'),
      text: t('modals.accountLogoutText'),
    });
    if (confirmed) {
      logout(uuid, accountId);
    }
  }

  function updateLoginValue(changes: Partial<LoginModel>) {
    const newJiraAccounts = jiraAccounts.map(account => {
      if (account.accountId === accountId) {
        return { ...account, ...changes };
      }
      return account;
    });
    setJiraAccounts(newJiraAccounts);
  }

  function updateWorkspaceDisplayName() {
    updateLoginValue({ workspaceDisplayName: customWorkspaceName });
  }

  function updateWorkspaceColor(newColor: ColorOption) {
    updateLoginValue({ workspaceColor: newColor });
  }

  function updateWorkspaceCustomColor() {
    // Make sure that the custom color is a valid hex color
    const hexColorRegex = /^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexColorRegex.test(customWorkspaceColorValue)) {
      return;
    }
    updateLoginValue({ customWorkspaceColor: `#${customWorkspaceColorValue}` });
  }

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.label}>{t('workspace.color')}</Text>
        <ColorSelector selectedColor={workspaceColor} setSelectedColor={updateWorkspaceColor} />
      </View>
      <View style={styles.inputsContainer}>
        <CustomTextInput
          label={t('workspace.name')}
          value={customWorkspaceName}
          numberOfLines={1}
          onChangeText={newText => setCustomWorkspaceName(newText)}
          containerStyle={[styles.input, { flexGrow: 1 }]}
          onBlur={updateWorkspaceDisplayName}
        />
        <CustomTextInput
          label={t('workspace.customColor')}
          value={customWorkspaceColorValue}
          numberOfLines={1}
          onChangeText={newText => setCustomWorkspaceColorValue(newText.replace('#', ''))}
          containerStyle={[styles.input, { flexBasis: 92, flexGrow: 0 }]}
          visiblePrefix='#'
          maxLength={6}
          onBlur={updateWorkspaceCustomColor}
        />
      </View>
      <View style={styles.buttonContainer}>
        <ButtonDanger label={t('account.logOut')} onPress={handleLogout} />
      </View>
    </View>
  );
};

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'column',
      gap: 18,
      width: '100%',
      marginTop: 20,
    },
    label: {
      ...typo.calloutEmphasized,
      color: theme.textPrimary,
      marginBottom: 4,
    },
    inputsContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      width: '100%',
      height: 50,
    },
    input: {
      flexGrow: 1,
    },
    buttonContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 10,
    },
  });
}
