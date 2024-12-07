import {
  AddNativeEventListenerParams,
  RemoveNativeEventListenerParams,
  SendNativeEventParams,
} from './native-event-emitter.service.types';

export function sendNativeEvent(_params: SendNativeEventParams) {
  console.warn('sendNativeEvent is not implemented');
}

export function addNativeEventListener(_params: AddNativeEventListenerParams) {
  console.warn('addNativeEventListener is not implemented');
}

export function removeNativeEventListener(_params: RemoveNativeEventListenerParams) {
  console.warn('removeNativeEventListener is not implemented');
}
