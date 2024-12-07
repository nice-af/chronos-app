import { NativeEventEmitter, NativeModule, NativeModules } from 'react-native';
import {
  AddNativeEventListenerParams,
  RemoveNativeEventListenerParams,
  SendNativeEventParams,
} from './native-event-emitter.service.types';

export function sendNativeEvent(params: SendNativeEventParams) {
  NativeModules.ReactNativeEventEmitter.sendEventFromReact(
    params.name,
    // We have to pass a string to the native side, so we need pass null as 'null' and stringify objects
    params.data === null ? 'null' : typeof params.data === 'string' ? params.data : JSON.stringify(params.data)
  );
}

const emitter = new NativeEventEmitter(NativeModules.ReactNativeEventEmitter as NativeModule);

export function addNativeEventListener(params: AddNativeEventListenerParams) {
  emitter.addListener(params.name, params.callback);
}

export function removeNativeEventListener(params: RemoveNativeEventListenerParams) {
  emitter.removeAllListeners(params.name);
}
