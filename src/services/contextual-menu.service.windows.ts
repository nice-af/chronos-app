import { ImageSourcePropType, NativeModules, findNodeHandle } from 'react-native';
import { MenuItem } from './contextual-menu.service.types';

type NativeContextMenuItem = {
  disabled?: boolean;
  icon?: ImageSourcePropType | null;
  label: string;
  onPress: () => void;
  checked?: boolean;
  type?: 'item';
};

export function showContextualMenu(menuItems: MenuItem[], target: React.ReactNode) {
  const wrappedItems: NativeContextMenuItem[] = menuItems.map(item => ({
    label: item.name,
    onPress: item.onClick,
    type: 'item',
  }));

  const onPress = (error: Error, index: number) => {
    wrappedItems[index].onPress();
  };

  NativeModules.ContextMenuNativeModule.showMenu(
    target ? findNodeHandle(target as any) ?? undefined : undefined,
    'bottom-left',
    menuItems,
    onPress,
    () => {}
  );
}

export function hideNativeContextMenu() {
  NativeModules.ContextMenuNativeModule.hideMenu();
}
