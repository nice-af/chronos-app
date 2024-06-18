import { GestureResponderEvent } from 'react-native';

export interface MenuItem {
  name: string;
  onClick: () => void;
}

export function isRightClick(e: GestureResponderEvent) {
  return (e.nativeEvent as any).button === 2;
}
