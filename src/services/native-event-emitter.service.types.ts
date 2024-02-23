export enum NativeEvent {
  STATUS_BAR_STATE_CHANGE = 'statusBarStateChange',
  STATUS_BAR_TEXT_CHANGE = 'statusBarTextChange',
  FULLSCREEN_CHANGE = 'fullscreenChange',
  PLAY_PAUSE_CLICK = 'playPauseClick',
}

export enum StatusBarState {
  RUNNING = 'running',
  PAUSED = 'paused',
}

export interface SendNativeEventParams {
  name: NativeEvent;
  data: string;
}

export interface StatusBarStateChangeData {
  state: StatusBarState;
  issueKey: string;
  issueSummary: string;
}

export interface SendNativeEventParams_DEFAULT {
  name: NativeEvent;
  data: string;
}

export type AddNativeEventListenerParams =
  | AddNativeEventListenerParams_STATUS_BAR_STATE_CHANGE
  | AddNativeEventListenerParams_STATUS_BAR_TEXT_CHANGE
  | AddNativeEventListenerParams_FULLSCREEN_CHANGE
  | AddNativeEventListenerParams_PLAY_PAUSE_CLICK;

export interface AddNativeEventListenerParams_STATUS_BAR_STATE_CHANGE {
  name: NativeEvent.STATUS_BAR_STATE_CHANGE;
  callback: (data: StatusBarState) => void;
}

export interface AddNativeEventListenerParams_STATUS_BAR_TEXT_CHANGE {
  name: NativeEvent.STATUS_BAR_TEXT_CHANGE;
  callback: (data: string) => void;
}

export interface AddNativeEventListenerParams_FULLSCREEN_CHANGE {
  name: NativeEvent.FULLSCREEN_CHANGE;
  callback: (data: 'true' | 'false') => void;
}

export interface AddNativeEventListenerParams_PLAY_PAUSE_CLICK {
  name: NativeEvent.PLAY_PAUSE_CLICK;
  callback: (data: StatusBarState) => void;
}

export interface RemoveNativeEventListenerParams {
  name: NativeEvent;
}
