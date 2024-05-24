import React, { FC, useState } from 'react';
import { Image, ImageSourcePropType, Pressable, StyleSheet, Text, View } from 'react-native';
import { useThemedStyles } from '../../services/theme.service';
import { Theme } from '../../styles/theme/theme-types';
import { typo } from '../../styles/typo';

interface CardsSelectionButtonProps {
  image: ImageSourcePropType;
  label: string;
  isChecked: boolean;
  onClick: () => void;
}

const CardsSelectionButton: FC<CardsSelectionButtonProps> = ({ isChecked, onClick, image, label }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.pressableContainer}>
      {isChecked && <View style={styles.checkedBorder} />}
      <Pressable
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        onPress={onClick}
        style={styles.pressable}>
        <View
          style={[
            styles.highlight,
            isHovered && styles.highlightHovered,
            isChecked && styles.highlightHovered,
            isPressed && styles.highlightPressed,
          ]}
        />
        <Image style={styles.image} source={image} />
      </Pressable>
      <Text style={isChecked ? styles.labelChecked : styles.label}>{label}</Text>
    </View>
  );
};

interface CardsSelectionButtonsProps {
  options: CardsSelectionButtonProps[];
}

export const CardsSelectionButtons: FC<CardsSelectionButtonsProps> = ({ options }) => {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.cardsContainer}>
      {options.map((option, index) => (
        <CardsSelectionButton key={index} {...option} />
      ))}
    </View>
  );
};

function createStyles(theme: Theme) {
  return StyleSheet.create({
    cardsContainer: {
      display: 'flex',
      gap: 10,
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    pressableContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: 2,
    },
    pressable: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
      width: 76,
      height: 48,
      padding: 0,
      borderRadius: 10,
      borderColor: theme.border,
      borderWidth: 1,
    },
    highlight: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: 74,
      height: 46,
      zIndex: 2,
      borderColor: theme.cardsSelectionButtonBorderInset,
      borderWidth: 1,
      borderRadius: 8,
    },
    highlightHovered: {
      backgroundColor: theme.cardsSelectionButtonHover,
    },
    highlightPressed: {
      backgroundColor: theme.cardsSelectionButtonActive,
    },
    checkedBorder: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: 80,
      height: 52,
      borderColor: theme.blue,
      borderWidth: 2,
      borderRadius: 11,
    },
    image: {
      width: 74,
      height: 46,
      borderRadius: 8,
    },
    labelChecked: {
      marginTop: 2,
      ...typo.subheadlineEmphasized,
      color: theme.textPrimary,
    },
    label: {
      marginTop: 2,
      ...typo.subheadline,
      color: theme.textPrimary,
    },
  });
}
