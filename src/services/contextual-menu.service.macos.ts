import { ActionSheetIOS, ActionSheetIOSOptions, findNodeHandle } from 'react-native';
import { MenuItem } from './contextual-menu.service.types';

export function showContextualMenu(menuItems: MenuItem[], target: React.ReactNode) {
  const options: ActionSheetIOSOptions = {
    options: menuItems.map(item => item.name),
    anchor: target ? findNodeHandle(target as any) ?? undefined : undefined,
  };

  ActionSheetIOS.showActionSheetWithOptions(options, buttonIndex => {
    menuItems[buttonIndex].onClick();
  });
}
