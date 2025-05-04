/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { NativeModules } from 'react-native';

NativeModules.DevSettings.setIsDebuggingRemotely(false);
AppRegistry.registerComponent(appName, () => App);
