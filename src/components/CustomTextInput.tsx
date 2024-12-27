import React, { FC, ReactNode, useEffect, useRef } from 'react';
import { Platform, StyleProp, StyleSheet, Text, TextInput, TextStyle, View } from 'react-native';
import { useThemedStyles } from '../services/theme.service';
import { Theme } from '../styles/theme/theme-types';
import { getPadding } from '../styles/utils';
import { typo } from '../styles/typo';

interface CustomTextInputProps {
  // Needed to blur the input when the modal is closed
  isVisible?: boolean;
  value: string;
  onChangeText: (text: string) => void;
  style?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<TextStyle>;
  inputContainerStyle?: StyleProp<TextStyle>;
  multiline?: boolean;
  numberOfLines?: number;
  placeholder?: string;
  iconLeft?: ReactNode;
  maxLength?: number;
  onBlur?: () => void;
  label?: string;
  visiblePrefix?: string;
}

export const CustomTextInput: FC<CustomTextInputProps> = ({
  isVisible,
  value,
  onChangeText,
  style,
  containerStyle,
  inputContainerStyle,
  multiline,
  numberOfLines,
  placeholder,
  iconLeft,
  maxLength,
  onBlur,
  label,
  visiblePrefix,
}) => {
  const inputRef = useRef<TextInput>(null);
  const showPlaceholder = !value || (value === '' && !!placeholder);
  const styles = useThemedStyles(createStyles);

  useEffect(() => {
    if (!isVisible && inputRef.current) {
      inputRef.current?.blur();
    }
  }, [isVisible]);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputContainer, inputContainerStyle]}>
        <TextInput
          ref={inputRef}
          style={[
            styles.input,
            iconLeft ? styles.inputWithIcon : undefined,
            multiline ? { textAlignVertical: 'center' } : undefined,
            !!visiblePrefix ? { paddingLeft: 32 } : undefined,
            style,
          ]}
          onChangeText={onChangeText}
          value={value}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          onBlur={onBlur}
        />
        {iconLeft && <View style={styles.iconContainer}>{iconLeft}</View>}
        {showPlaceholder && (
          <Text style={[styles.placeholder, iconLeft ? styles.placeholderWithIcon : undefined, style]}>
            {placeholder}
          </Text>
        )}
        {visiblePrefix && (
          <View style={styles.prefixContainer}>
            <Text style={styles.prefix}>{visiblePrefix}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

function createStyles(theme: Theme) {
  // This needs to be assigned to `styles` for react-native/no-unused-styles to work
  const styles = StyleSheet.create({
    container: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
    },
    label: {
      ...typo.calloutEmphasized,
      color: theme.textPrimary,
      marginBottom: 2,
    },
    inputContainer: {
      position: 'relative',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.inputBorder,
      overflow: 'hidden',
    },
    input: {
      width: '100%',
      ...getPadding(7, 12, 9),
      backgroundColor: theme.backgroundDark,
      color: theme.textPrimary,
      borderRadius: 7,
      borderWidth: 0,
    },
    inputWithIcon: {
      paddingLeft: 32,
    },
    iconContainer: {
      position: 'absolute',
      top: 9,
      left: 11,
      width: 16,
      height: 16,
    },
    placeholder: {
      position: 'absolute',
      width: '100%',
      height: 20,
      color: theme.textSecondary,
      pointerEvents: 'none',
      ...Platform.select({
        windows: {
          top: 6,
          left: 0,
        },
        macos: {
          top: 8,
          left: 15,
        },
      }),
    },
    placeholderWithIcon: {
      left: 35,
    },
    prefixContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 26,
      height: '100%',
      backgroundColor: theme.surface,
    },
    prefix: {
      ...typo.body,
      width: '100%',
      paddingLeft: 2,
      color: theme.textSecondary,
      textAlign: 'center',
    },
  });
  return styles;
}
