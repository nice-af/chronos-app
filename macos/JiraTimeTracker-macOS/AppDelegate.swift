import Foundation
import Cocoa
import SwiftUI

@NSApplicationMain
class AppDelegate: NSObject, NSApplicationDelegate {
  var windowController: CustomWindowController
  var statusBarManager: StatusBarManager
  
  // The new event handler for deep links
  @objc public func getUrl(_ event: NSAppleEventDescriptor, withReplyEvent reply: NSAppleEventDescriptor) -> Void {
    return RCTLinkingManager.getUrlEventHandler(event, withReplyEvent: reply)
  }
  
  override init() {
    let newWindowController  = CustomWindowController()
    self.windowController = newWindowController
    self.statusBarManager = StatusBarManager(newWindowController: newWindowController)
    super.init()
  }
  
  func applicationDidFinishLaunching(_ aNotification: Notification) {
    // Assign the new handler for deep links
    let em = NSAppleEventManager.shared()
    em.setEventHandler(self, andSelector: #selector(self.getUrl(_:withReplyEvent:)), forEventClass: AEEventClass(kInternetEventClass), andEventID: AEEventID(kAEGetURL))
    
    let jsCodeLocation: URL
#if DEBUG
    jsCodeLocation = RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    jsCodeLocation = Bundle.main.url(forResource: "main", withExtension: "jsbundle")!
#endif
    
    let rootView = RCTRootView(bundleURL: jsCodeLocation, moduleName: "JiraTimeTracker", initialProperties: nil, launchOptions: nil)
    let rootViewController = NSViewController()
    rootViewController.view = rootView
    
    // Create the application window
    self.windowController.window!.contentViewController = rootViewController
    let screen: NSScreen = NSScreen.main!
    let midScreenX = screen.frame.midX
    let posScreenY = 200
    let origin = CGPoint(x: Int(midScreenX), y: posScreenY)
    let size = CGSize(width: 460, height: 548)
    let frame = NSRect(origin: origin, size: size)
    windowController.window!.setFrame(frame, display: true)
    windowController.window!.center()
    windowController.window!.makeKeyAndOrderFront(self)
  }
  
  // Reopen window on dock icon click
  func applicationShouldHandleReopen(_ sender: NSApplication, hasVisibleWindows flag: Bool) -> Bool {
    windowController.window!.makeKeyAndOrderFront(self)
    return true;
  }
}
