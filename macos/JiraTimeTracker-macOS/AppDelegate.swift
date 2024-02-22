import Foundation
import Cocoa
import SwiftUI

@NSApplicationMain
class AppDelegate: NSObject, NSApplicationDelegate {
  var windowController: CustomWindowController
  var menubarManager: MenubarManager
  
  // The new event handler for deep links
  @objc public func getUrl(_ event: NSAppleEventDescriptor, withReplyEvent reply: NSAppleEventDescriptor) -> Void {
    return RCTLinkingManager.getUrlEventHandler(event, withReplyEvent: reply)
  }
  
  override init() {
    print("AppDelegate init START")
    self.windowController = CustomWindowController()
    self.menubarManager = MenubarManager()
    super.init()
    print("AppDelegate init STOP")
  }
  
  func applicationDidFinishLaunching(_ aNotification: Notification) {
    print("applicationDidFinishLaunching START")
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
    
    // Create MenubarManager to handle the menubar buttom
    self.menubarManager.setWindowController(newWindowController: windowController)
    print("applicationDidFinishLaunching STOP")
  }
  
  // Reopen window on dock icon click
  func applicationShouldHandleReopen(_ sender: NSApplication, hasVisibleWindows flag: Bool) -> Bool {
    windowController.window!.makeKeyAndOrderFront(self)
    return true;
  }
  
  
  func moveButtonDown(button: NSView) {
    button.setFrameOrigin(NSMakePoint(button.frame.origin.x, button.frame.origin.y-2.0))
  }
}
