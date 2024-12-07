import { GestureResponderEvent } from 'react-native';

export interface MenuItem {
  name: string;
  onClick: () => void;
}

export function isRightClick(e: GestureResponderEvent) {
  return (e.nativeEvent as any).button === 2;
}

export function showContextualMenu(_menuItems: MenuItem[], _target: React.ReactNode) {
  // TODO: Implement showContextualMenu for windows
  return;
}
