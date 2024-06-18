import React from 'react';
import { MenuItem } from '../services/contextual-menu.service';

export interface ContextualMenuWindowsProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children: React.ReactNode;
  menuItems: MenuItem[];
}
