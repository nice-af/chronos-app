class EventEmitter {
  /// Shared Instance.
  public static var sharedInstance = EventEmitter()
  
  // ReactNativeEventEmitter is instantiated by React Native with the bridge.
  private static var eventEmitter: ReactNativeEventEmitter!
  
  private init() {}
  
  // When React Native instantiates the emitter it is registered here.
  func registerEventEmitter(eventEmitter: ReactNativeEventEmitter) {
    EventEmitter.eventEmitter = eventEmitter
  }
  
  func dispatch(name: String, body: Any?) {
    EventEmitter.eventEmitter.sendEvent(withName: name, body: body)
  }
  
  /// All Events which must be support by React Native.
  lazy var allEvents: [String] = {
    // Append all events here
    var allEventNames: [String] = [
      "statusBarStateChange",
      "statusBarTimeChange",
      "fullscreenChange",
      "playPauseClick",
      "closeOverlay",
      "closeModal",
      "createNewWorklog",
      "resetWorklogsForSelectedDate",
      "sendNotification",
      "requestNotificationPermission",
      "checkNotificationPermission",
      "themeChanged"
    ]
    return allEventNames
  }()
}
