import { NativeEvent } from './native-event-emitter.service.types';

export function sendNativeEvent(name: NativeEvent, data: string) {
  console.error('sendNativeEvent is not implemented');
}

export function addNativeEventListener(name: NativeEvent, callback: (data: string) => void) {
  console.error('addNativeEventListener is not implemented');
}

export function removeNativeEventListener(name: NativeEvent) {
  console.error('removeNativeEventListener is not implemented');
}
