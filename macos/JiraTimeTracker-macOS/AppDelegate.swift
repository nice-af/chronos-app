import Foundation
import Cocoa

@NSApplicationMain
class AppDelegate: NSObject, NSApplicationDelegate {
  var popover: NSPopover!
  var window: NSWindow!
  var statusBarItem: NSStatusItem!

  func applicationDidFinishLaunching(_ aNotification: Notification) {
    let jsCodeLocation: URL

    #if DEBUG
      jsCodeLocation = RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
    #else
      jsCodeLocation = Bundle.main.url(forResource: "main", withExtension: "jsbundle")!
    #endif
    let rootView = RCTRootView(bundleURL: jsCodeLocation, moduleName: "JiraTimeTracker", initialProperties: nil, launchOptions: nil)
    let rootViewController = NSViewController()
    rootViewController.view = rootView

    popover = NSPopover()

    popover.contentSize = NSSize(width: 700, height: 800)
    popover.animates = true
    popover.behavior = .transient
    popover.contentViewController = rootViewController

    statusBarItem = NSStatusBar.system.statusItem(withLength: CGFloat(60))

    if let button = self.statusBarItem.button {
      button.action = #selector(togglePopover(_:))
      button.title = "JTA"
    }

    #if DEBUG
    window = NSWindow(
      contentRect: NSRect(x: 0, y: 0, width: 1, height: 1),
      styleMask: [.titled, .closable, .miniaturizable, .resizable],
      backing: .buffered,
      defer: false)

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
    #endif
  }

  @objc func togglePopover(_ sender: AnyObject?) {
    if let button = self.statusBarItem.button {
      if self.popover.isShown {
        self.popover.performClose(sender)
      } else {
        self.popover.show(relativeTo: button.bounds, of: button, preferredEdge: NSRectEdge.minY)

        self.popover.contentViewController?.view.window?.becomeKey()
      }
    }
  }
}
