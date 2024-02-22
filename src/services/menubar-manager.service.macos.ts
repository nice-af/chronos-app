import { NativeModules } from 'react-native';
import { ManubarManagerService } from './menubar-manager.service.types';

export const setMenubarText: ManubarManagerService['setMenubarText'] = (newText: string) => {
  NativeModules.MenubarManager.setText(newText);
};

export const setMenubarState: ManubarManagerService['setMenubarState'] = (newState: string) => {
  NativeModules.MenubarManager.setState(newState);
};
