/**
 * Windows has a different style of ContextualMenu than macOS.
 * It is using a component called MenuFlyout instead of a regular function.
 */

import React, { FC } from 'react';
import { ContextualMenuWindowsProps } from './ContextualMenuWindows.types';
import { MenuFlyout, MenuFlyoutItem } from 'react-native-xaml';

export const ContextualMenuWindows: FC<ContextualMenuWindowsProps> = ({ isOpen, setIsOpen, menuItems, children }) => {
  return (
    <MenuFlyout
      isOpen={isOpen}
      onClosed={() => {
        setIsOpen(false);
      }}>
      {menuItems.map(item => (
        <MenuFlyoutItem key={item.name} text={item.name} onClick={item.onClick} />
      ))}
      {children}
    </MenuFlyout>
  );
};
