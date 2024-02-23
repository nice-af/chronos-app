import { NativeEventEmitter, NativeModules } from 'react-native';
import {
  AddNativeEventListenerParams,
  RemoveNativeEventListenerParams,
  SendNativeEventParams,
} from './native-event-emitter.service.types';

export function sendNativeEvent(params: SendNativeEventParams) {
  NativeModules.ReactNativeEventEmitter.sendEventFromReact(params.name, params.data);
}

const emitter = new NativeEventEmitter(NativeModules.ReactNativeEventEmitter);

export function addNativeEventListener(params: AddNativeEventListenerParams) {
  emitter.addListener(params.name, params.callback);
}

export function removeNativeEventListener(params: RemoveNativeEventListenerParams) {
  emitter.removeAllListeners(params.name);
}
