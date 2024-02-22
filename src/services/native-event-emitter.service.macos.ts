import { NativeEventEmitter, NativeModules } from 'react-native';
import { NativeEvent } from './native-event-emitter.service.types';

export function sendNativeEvent(name: NativeEvent, data: string) {
  NativeModules.ReactNativeEventEmitter.sendEventFromReact(name, data);
}

const emitter = new NativeEventEmitter(NativeModules.ReactNativeEventEmitter);

export function addNativeEventListener(name: NativeEvent, callback: (data: string) => void) {
  emitter.addListener(name, callback);
}

export function removeNativeEventListener(name: NativeEvent) {
  emitter.removeAllListeners(name);
}
