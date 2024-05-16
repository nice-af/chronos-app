export enum NativeEvent {
  STATUS_BAR_STATE_CHANGE = 'statusBarStateChange',
  STATUS_BAR_TIME_CHANGE = 'statusBarTimeChange',
  FULLSCREEN_CHANGE = 'fullscreenChange',
  PLAY_PAUSE_CLICK = 'playPauseClick',
  CLOSE_OVERLAY = 'closeOverlay',
  CLOSE_MODAL = 'closeModal',
  CREATE_NEW_WORKLOG = 'createNewWorklog',
  RESET_WORKLOGS_FOR_SELECTED_DATE = 'resetWorklogsForSelectedDate',
  SEND_NOTIFICATION = 'sendNotification',
  REQUEST_NOTIFICATION_PERMISSION = 'requestNotificationPermission',
  CHECK_NOTIFICATION_PERMISSION = 'checkNotificationPermission',
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
  | AddNativeEventListenerParams_STATUS_BAR_TIME_CHANGE
  | AddNativeEventListenerParams_FULLSCREEN_CHANGE
  | AddNativeEventListenerParams_PLAY_PAUSE_CLICK
  | AddNativeEventListenerParams_CHECK_NOTIFICATION_PERMISSION
  | AddNativeEventListenerParams_DEFAULT;

export interface AddNativeEventListenerParams_STATUS_BAR_STATE_CHANGE {
  name: NativeEvent.STATUS_BAR_STATE_CHANGE;
  callback: (data: StatusBarState) => void;
}

export interface AddNativeEventListenerParams_STATUS_BAR_TIME_CHANGE {
  name: NativeEvent.STATUS_BAR_TIME_CHANGE;
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

export interface AddNativeEventListenerParams_CHECK_NOTIFICATION_PERMISSION {
  name: NativeEvent.CHECK_NOTIFICATION_PERMISSION;
  callback: (data: 'granted' | 'denied') => void;
}

export interface AddNativeEventListenerParams_DEFAULT {
  name:
    | NativeEvent.CLOSE_OVERLAY
    | NativeEvent.CLOSE_MODAL
    | NativeEvent.CREATE_NEW_WORKLOG
    | NativeEvent.RESET_WORKLOGS_FOR_SELECTED_DATE;
  callback: () => void;
}

export interface RemoveNativeEventListenerParams {
  name: NativeEvent;
}
