import { ActionSheetIOS, ActionSheetIOSOptions, GestureResponderEvent } from 'react-native';

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
  };

  ActionSheetIOS.showActionSheetWithOptions(options, buttonIndex => {
    menuItems[buttonIndex].onClick();
  });
}
