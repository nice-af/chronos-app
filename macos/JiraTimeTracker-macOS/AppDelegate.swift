import Foundation
import Cocoa

@NSApplicationMain
class AppDelegate: NSObject, NSApplicationDelegate {
  var popover: NSPopover!
  var window: NSWindow!
  var statusBarItem: NSStatusItem!
  
  // The new event handler for deep links
  @objc public func getUrl(_ event: NSAppleEventDescriptor, withReplyEvent reply: NSAppleEventDescriptor) -> Void {
    return RCTLinkingManager.getUrlEventHandler(event, withReplyEvent: reply)
  }

  func applicationDidFinishLaunching(_ aNotification: Notification) {
    // Assign the new handler for deep links
    var em = NSAppleEventManager.shared()
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

    statusBarItem = NSStatusBar.system.statusItem(withLength: CGFloat(60))

    if let button = self.statusBarItem.button {
      button.action = #selector(toggleWindow(_:))
      button.title = "JTA"
    }

    // Create the application window
    window = NSWindow(
      contentRect: NSRect(x: 0, y: 0, width: 1, height: 1),
      styleMask: [.titled, .closable, .miniaturizable, .resizable],
      backing: .buffered,
      defer: false)

    window.isOpaque = false
    window.titlebarAppearsTransparent = true
    window.makeKeyAndOrderFront(nil)
    window.isMovableByWindowBackground = true
    window.titlebarAppearsTransparent = true
    window.titleVisibility = .hidden
    window.contentViewController = rootViewController
    window.center()
    window.setFrameAutosaveName("Tempomat Main Window")
    window.isReleasedWhenClosed = false
    window.makeKeyAndOrderFront(self)
    let screen: NSScreen = NSScreen.main!
    let midScreenX = screen.frame.midX
    let posScreenY = 200
    let origin = CGPoint(x: Int(midScreenX), y: posScreenY)
    let size = CGSize(width: 700, height: 800)
    let frame = NSRect(origin: origin, size: size)
    window.setFrame(frame, display: true)
  }
  
  @objc func toggleWindow(_ sender: AnyObject?) {
    if let button = self.statusBarItem.button {
      if self.window.isMiniaturized {
        self.window.close()
      } else {
        self.window.display();
        self.window.becomeKey();
        // self.window.show(relativeTo: button.bounds, of: button, preferredEdge: NSRectEdge.minY)

        // self.popover.contentViewController?.view.window?.becomeKey()
      }
    }
  }
}
