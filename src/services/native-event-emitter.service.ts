import {
  AddNativeEventListenerParams,
  RemoveNativeEventListenerParams,
  SendNativeEventParams,
} from './native-event-emitter.service.types';

export function sendNativeEvent(params: SendNativeEventParams) {
  console.warn('sendNativeEvent is not implemented');
}

export function addNativeEventListener(params: AddNativeEventListenerParams) {
  console.warn('addNativeEventListener is not implemented');
}

export function removeNativeEventListener(params: RemoveNativeEventListenerParams) {
  console.warn('removeNativeEventListener is not implemented');
}
