import { useAtomValue } from 'jotai';
import React, { useRef, useState } from 'react';
import { Animated, Image } from 'react-native';
import { themeAtom } from '../atoms';
import { showContextualMenu } from '../services/contextual-menu.service';
import { ButtonSecondary } from './ButtonSecondary';
import { ro } from 'date-fns/locale';

type OptionValue = string | number;

interface SelectProps<T extends OptionValue> {
  options: { label: string; value: OptionValue }[];
  value: T;
  onChange: (value: T) => void;
}

export function Select<T extends OptionValue>({ options, value, onChange }: SelectProps<T>) {
  const ref = useRef(null);
  const theme = useAtomValue(themeAtom);

  function handlePress() {
    showContextualMenu(
      options.map(option => ({
        name: (option.value === value ? '✓ ' : '    ') + option.label,
        onClick: () => {
          onChange(option.value as T);
        },
      })),
      ref.current
    );
  }

  return (
    <ButtonSecondary
      onPress={handlePress}
      label={options.find(option => option.value === value)?.label}
      isSmall
      ref={ref}
      iconRight={
        <Image
          source={
            theme.type === 'light'
              ? require('../assets/icons/chevron-down-small-light.png')
              : require('../assets/icons/chevron-down-small-dark.png')
          }
        />
      }
    />
  );
}
