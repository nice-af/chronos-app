import { appVisibility } from '../const';
import { ThemeKey } from './storage.service';

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
  THEME_CHANGED = 'themeChanged',
  SET_APP__VISIBILITY = 'setappVisibility',
}

export enum StatusBarState {
  RUNNING = 'running',
  PAUSED = 'paused',
}

/**
 * Send event types
 */

export type SendNativeEventParams =
  | SendNativeEventParams_DEFAULT
  | SendNativeEventParams_STATUS_BAR_STATE_CHANGE
  | SendNativeEventParams_STATUS_BAR_TIME_CHANGE
  | SendNativeEventParams_SEND_NOTIFICATION
  | SendNativeEventParams_THEME_CHANGED
  | SendNativeEventParams_SET_APP__VISIBILITY;

export interface SendNativeEventParams_DEFAULT {
  name: NativeEvent.REQUEST_NOTIFICATION_PERMISSION;
  data: null;
}

export type StatusBarStateChangeData = StatusBarStateChangeDataRunning | StatusBarStateChangeDataPause;
export interface StatusBarStateChangeDataRunning {
  state: StatusBarState.RUNNING;
  issueKey: string;
  issueSummary: string;
}

export interface StatusBarStateChangeDataPause {
  state: StatusBarState.PAUSED;
}

export interface SendNativeEventParams_STATUS_BAR_STATE_CHANGE {
  name: NativeEvent.STATUS_BAR_STATE_CHANGE;
  data: StatusBarStateChangeData;
}

export interface SendNativeEventParams_STATUS_BAR_TIME_CHANGE {
  name: NativeEvent.STATUS_BAR_TIME_CHANGE;
  data: string | null;
}

export interface SendNativeEventParams_SEND_NOTIFICATION {
  name: NativeEvent.SEND_NOTIFICATION;
  data: {
    title: string;
    message: string;
  };
}

export interface SendNativeEventParams_THEME_CHANGED {
  name: NativeEvent.THEME_CHANGED;
  data: Omit<ThemeKey, 'system'>;
}

export interface SendNativeEventParams_SET_APP__VISIBILITY {
  name: NativeEvent.SET_APP__VISIBILITY;
  data: appVisibility;
}

/**
 * Add event listener types
 */

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

/**
 * Remove event listener types
 */

export interface RemoveNativeEventListenerParams {
  name: NativeEvent;
}
