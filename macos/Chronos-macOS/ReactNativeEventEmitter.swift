import Foundation
import React

@objc(ReactNativeEventEmitter)
open class ReactNativeEventEmitter: RCTEventEmitter {
  override init() {
    super.init()
    EventEmitter.sharedInstance.registerEventEmitter(eventEmitter: self)
  }
  
  /// Base overide for RCTEventEmitter.
  ///
  /// - Returns: all supported events
  @objc override open func supportedEvents() -> [String] {
    return EventEmitter.sharedInstance.allEvents
  }
  
  @objc(sendEventFromReact:body:)
  func sendEventFromReact(name: String, body: String) {
    NotificationCenter.default.post(name: NSNotification.Name(name), object: body)
  }
  
  @objc
  override public static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
