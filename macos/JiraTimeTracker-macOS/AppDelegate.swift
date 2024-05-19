import Foundation
import Cocoa
import SwiftUI
import UserNotifications

@NSApplicationMain
class AppDelegate: NSObject, NSApplicationDelegate {
  var windowController: CustomWindowController
  var statusBarManager: StatusBarManager
  
  override init() {
    let newWindowController  = CustomWindowController()
    self.windowController = newWindowController
    self.statusBarManager = StatusBarManager(newWindowController: newWindowController)
    super.init()
  }
  
  func applicationDidFinishLaunching(_ aNotification: Notification) {
    // Listen to notification events
    NotificationCenter.default.addObserver(self, selector: #selector(sendNotification), name: NSNotification.Name("sendNotification"), object: nil)
    NotificationCenter.default.addObserver(self, selector: #selector(checkNotificationPermissions), name: NSNotification.Name("requestNotificationPermission"), object: nil)
    // Enable notifications when the app is focused
    UNUserNotificationCenter.current( ).delegate = self
    
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
  
  //
  // Reopen window on dock icon click
  //
  func applicationShouldHandleReopen(_ sender: NSApplication, hasVisibleWindows flag: Bool) -> Bool {
    windowController.window!.makeKeyAndOrderFront(self)
    return true;
  }
  
  //
  // The actions for the menubar items
  //
  @IBAction func openGitHubURL(_ sender: AnyObject) {
    let url = URL(string: "https://github.com/AdrianFahrbach/JiraTimeTracker")
    NSWorkspace.shared.open(url!)
  }
  @IBAction func closeOverlay(_ sender: AnyObject) {
    // The shortcut for this action is handled in the CustomWindow class, because the escape key is reserved
    EventEmitter.sharedInstance.dispatch(name: "closeOverlay", body: "")
  }
  @IBAction func createNewWorklog(_ sender: AnyObject) {
    EventEmitter.sharedInstance.dispatch(name: "createNewWorklog", body: "")
  }
  @IBAction func resetWorklogsForSelectedDate(_ sender: AnyObject) {
    EventEmitter.sharedInstance.dispatch(name: "resetWorklogsForSelectedDate", body: "")
  }
  
  //
  // Listen to notification event
  //
  let un = UNUserNotificationCenter.current()
  struct TrackingReminderData: Codable {
    let title: String
    let message: String
  }
  @objc func checkNotificationPermissions() -> Void {
    un.requestAuthorization(options: [.alert, .sound]) { (authorized, error) in
      if authorized {
        EventEmitter.sharedInstance.dispatch(name: "checkNotificationPermission", body: "granted")
      } else {
        EventEmitter.sharedInstance.dispatch(name: "checkNotificationPermission", body: "denied")
      }
    }
  }
  @objc func sendNotification(notification: NSNotification) -> Void {
    checkNotificationPermissions();
    guard let jsonString = notification.object as? String else {
      print("Reminder notification object is not a string")
      return
    }
    let jsonData = jsonString.data(using: .utf8)!
    let data: TrackingReminderData = try! JSONDecoder().decode(TrackingReminderData.self, from: jsonData)
    
    un.getNotificationSettings { (settings) in
      if settings.authorizationStatus == .authorized {
        let content = UNMutableNotificationContent()
        content.title = data.title
        content.body = data.message
        
        let currentDate = Date()
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd_HH-mm"
        let dateString = formatter.string(from: currentDate)
        let id = "JiraTimeTrackerReminder_" + dateString

        let trigger = UNTimeIntervalNotificationTrigger(timeInterval: 1, repeats: false)
        let request = UNNotificationRequest(identifier: id, content: content, trigger: trigger)
        self.un.add (request) { (error) in
          if error != nil { print (error?.localizedDescription as Any)}
        }
      }
    }
  }
  
  //
  // Handle deep links
  //
  @objc public func getUrl(_ event: NSAppleEventDescriptor, withReplyEvent reply: NSAppleEventDescriptor) -> Void {
    return RCTLinkingManager.getUrlEventHandler(event, withReplyEvent: reply)
  }
}

// Enable notifications when the app is focused
extension AppDelegate: UNUserNotificationCenterDelegate {
  func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
    return completionHandler([.banner, .sound])
  }
}
