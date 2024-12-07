import { ActionSheetIOS, ActionSheetIOSOptions } from 'react-native';
import { GestureResponderEvent, findNodeHandle } from 'react-native';

interface MenuItem {
  name: string;
  onClick: () => void;
}

export function isRightClick(e: GestureResponderEvent) {
  return (e.nativeEvent as any).button === 2;
}

export function showContextualMenu(menuItems: MenuItem[], target: React.ReactNode) {
  const options: ActionSheetIOSOptions = {
    options: menuItems.map(item => item.name),
    anchor: target ? (findNodeHandle(target as number) ?? undefined) : undefined,
  };

  ActionSheetIOS.showActionSheetWithOptions(options, buttonIndex => {
    menuItems[buttonIndex].onClick();
  });
}
