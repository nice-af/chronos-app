import Foundation

@objc(ReactNativeEventEmitter)
open class ReactNativeEventEmitter: RCTEventEmitter {
  
  override init() {
    super.init()
    EventEmitter.sharedInstance.registerEventEmitter(eventEmitter: self)
  }
  
  /// Base overide for RCTEventEmitter.
  ///
  /// - Returns: all supported events
  @objc open override func supportedEvents() -> [String] {
    return EventEmitter.sharedInstance.allEvents
  }
  
  @objc(sendEventFromReact:body:)
  func sendEventFromReact(name: String, body: String) -> Void {
    NotificationCenter.default.post(name: NSNotification.Name(name), object: body)
  }
  
  @objc
  public override static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
