import React, { FC, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useThemedStyles } from '../../services/theme.service';
import { Theme } from '../../styles/theme/theme-types';
import { LogoType } from '../../types/accounts.types';
import { WorkspaceLogo } from '../WorkspaceLogo';

interface LogoSelectorProps {
  workspaceUrl: string;
  workspaceAvatarUrl: string;
  selectedLogo: LogoType;
  onLogoChange: (logoType: LogoType) => void;
}

interface LogoOptionProps {
  logoType: LogoType;
  isSelected: boolean;
  onPress: () => void;
  workspaceUrl: string;
  workspaceAvatarUrl: string;
}

const LogoOption: FC<LogoOptionProps> = ({ logoType, isSelected, onPress, workspaceUrl, workspaceAvatarUrl }) => {
  const [isHovered, setIsHovered] = useState(false);
  const styles = useThemedStyles(createStyles);

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      style={styles.logoOption}>
      {isSelected && <View style={styles.selectionBorder} />}
      <View
        style={[
          styles.logoContainer,
          isHovered && styles.logoContainerHovered,
          isSelected && styles.logoContainerSelected,
        ]}>
        <WorkspaceLogo
          size={32}
          workspaceUrl={workspaceUrl}
          workspaceAvatarUrl={workspaceAvatarUrl}
          logoVariant={logoType}
          borderRadius={6}
        />
      </View>
    </Pressable>
  );
};

export const LogoSelector: FC<LogoSelectorProps> = ({
  workspaceUrl,
  workspaceAvatarUrl,
  selectedLogo,
  onLogoChange,
}) => {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.container}>
      <LogoOption
        logoType='navbarLogo'
        isSelected={selectedLogo === 'navbarLogo'}
        onPress={() => onLogoChange('navbarLogo')}
        workspaceUrl={workspaceUrl}
        workspaceAvatarUrl={workspaceAvatarUrl}
      />
      <LogoOption
        logoType='workspaceLogo'
        isSelected={selectedLogo === 'workspaceLogo'}
        onPress={() => onLogoChange('workspaceLogo')}
        workspaceUrl={workspaceUrl}
        workspaceAvatarUrl={workspaceAvatarUrl}
      />
    </View>
  );
};

function createStyles(theme: Theme) {
  const styles = StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'row',
      gap: 8,
      alignItems: 'flex-start',
    },
    logoOption: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
    },
    selectionBorder: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 2,
      borderWidth: 2,
      borderColor: theme.blue,
      borderRadius: 10,
      pointerEvents: 'none',
    },
    logoContainer: {
      position: 'relative',
      width: 40,
      height: 40,
      zIndex: 1,
      padding: 4,
      borderRadius: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoContainerHovered: {
      backgroundColor: theme.surfaceButtonHover,
    },
    logoContainerSelected: {
      borderColor: theme.transparent,
    },
  });
  return styles;
}
