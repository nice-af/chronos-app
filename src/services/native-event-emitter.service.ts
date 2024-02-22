import {
  AddNativeEventListenerParams,
  RemoveNativeEventListenerParams,
  SendNativeEventParams,
} from './native-event-emitter.service.types';

export function sendNativeEvent(params: SendNativeEventParams) {
  console.error('sendNativeEvent is not implemented');
}

export function addNativeEventListener(params: AddNativeEventListenerParams) {
  console.error('addNativeEventListener is not implemented');
}

export function removeNativeEventListener(params: RemoveNativeEventListenerParams) {
  console.error('removeNativeEventListener is not implemented');
}
