import React, { FC, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { logout } from '../../atoms';
import { useTranslation } from '../../services/i18n.service';
import { useModal } from '../../services/modal.service';
import { JiraAccountModel } from '../../services/storage.service';
import { useThemedStyles } from '../../services/theme.service';
import { Theme } from '../../styles/theme/theme-types';
import { typo } from '../../styles/typo';
import { ButtonDanger } from '../ButtonDanger';
import { CustomTextInput } from '../CustomTextInput';
import { ColorOption, ColorSelector } from './ColorSelector';

interface AccountSettingsOptionsProps {
  jiraAccount: JiraAccountModel;
}

export const AccountSettingsOptions: FC<AccountSettingsOptionsProps> = ({ jiraAccount }) => {
  const { accountId, workspaceName } = jiraAccount;
  const [customWorkspaceName, setCustomWorkspaceName] = useState(workspaceName);
  const [customColorValue, setCustomColorValue] = useState('');
  const [workspaceColor, setWorkspaceColor] = useState<ColorOption>('custom');
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
      logout(accountId);
    }
  }

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.label}>{t('workspace.color')}</Text>
        <ColorSelector selectedColor={workspaceColor} setSelectedColor={setWorkspaceColor} />
      </View>
      <View style={styles.inputsContainer}>
        <CustomTextInput
          label={t('workspace.name')}
          value={customWorkspaceName}
          numberOfLines={1}
          onChangeText={newText => setCustomWorkspaceName(newText)}
          containerStyle={[styles.input, { flexGrow: 1 }]}
        />
        <CustomTextInput
          label={t('workspace.customColor')}
          value={customColorValue}
          numberOfLines={1}
          onChangeText={newText => setCustomColorValue(newText)}
          containerStyle={[styles.input, { flexBasis: 92, flexGrow: 0 }]}
          visiblePrefix='#'
          maxLength={6}
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
