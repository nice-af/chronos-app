import React, { FC, useState } from 'react';
import { Image, ImageSourcePropType, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useThemedStyles } from '../services/theme.service';
import { Theme } from '../styles/theme/theme-types';
import { getPadding } from '../styles/utils';
import { border } from 'polished';

interface TabData {
  label: string;
  imageSrc: ImageSourcePropType;
}

interface TabProps extends TabData {
  isActive: boolean;
  isFirst: boolean;
  isLast: boolean;
  onPress: () => void;
}

const Tab: FC<TabProps> = ({ label, imageSrc, isActive, isFirst, isLast, onPress }) => {
  const styles = useThemedStyles(createStyles);

  return (
    <Pressable
      style={[styles.tab, isActive && styles.tabActive, isFirst && styles.tabFirst, isLast && styles.tabLast]}
      onPress={onPress}>
      <Image style={styles.logo} source={imageSrc} />
      <Text>{label}</Text>
    </Pressable>
  );
};

interface TabsProps {
  tabs: TabData[];
}

export const Tabs: FC<TabsProps> = ({ tabs }) => {
  const styles = useThemedStyles(createStyles);
  const [activeTab, setActiveTab] = useState(0);

  return (
    <View style={styles.container}>
      <View style={styles.borderTop} />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsHorizontalScrollIndicator={false} horizontal>
        {tabs.map((tab, index) => {
          const isActive = index === activeTab;
          const previousIsActive = index === activeTab - 1;
          const isFirst = index === 0;
          const isLast = index === tabs.length - 1;
          return (
            <>
              <Tab
                key={index + tab.label}
                {...tab}
                isActive={isActive}
                isFirst={isFirst}
                isLast={isLast}
                onPress={() => setActiveTab(index)}
              />
              {!isActive && !previousIsActive && !isLast && <View style={styles.spacer} />}
            </>
          );
        })}
      </ScrollView>
    </View>
  );
};

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      borderColor: theme.border,
      borderBottomWidth: 1,
      backgroundColor: theme.backgroundDark,
    },
    borderTop: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 1,
      backgroundColor: theme.border,
    },
    scrollContainer: {
      alignItems: 'center',
    },
    tab: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderColor: 'transparent',
      gap: 4,
      ...getPadding(6, 16),
    },
    tabActive: {
      borderBottomLeftRadius: 5,
      borderBottomRightRadius: 5,
      borderColor: theme.border,
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderBottomWidth: 1,
      backgroundColor: theme.background,
      marginBottom: -1,
    },
    tabFirst: {
      marginLeft: -4,
      paddingLeft: 20,
      borderLeftWidth: 1,
    },
    tabLast: {
      marginRight: -4,
      paddingRight: 20,
      borderRightWidth: 1,
    },
    spacer: {
      width: 1,
      height: 20,
      backgroundColor: theme.border,
    },
    logo: {
      width: 20,
      height: 20,
      marginRight: 2,
      borderRadius: 5,
      backgroundColor: theme.surfaceButtonBase,
    },
  });
}
