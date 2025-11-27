import Cocoa
import Foundation
import React_RCTAppDelegate
import SwiftUI
import UserNotifications
import WidgetKit

@NSApplicationMain
class AppDelegate: RCTAppDelegate {
  var windowController: CustomWindowController
  var statusBarManager: StatusBarManager

  override init() {
    self.windowController = CustomWindowController()
    self.statusBarManager = StatusBarManager(newWindowController: self.windowController)
    super.init()
  }

  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }

  deinit {
    NotificationCenter.default.removeObserver(self)
  }

  override func applicationDidFinishLaunching(_ notification: Notification) {
    // Basically the initialization of the app
    self.automaticallyLoadReactNativeWindow = false
    self.moduleName = "Chronos"

    // Listen to notification events
    NotificationCenter.default.addObserver(
      self, selector: #selector(sendNotification), name: NSNotification.Name("sendNotification"),
      object: nil)
    NotificationCenter.default.addObserver(
      self, selector: #selector(checkNotificationPermissions),
      name: NSNotification.Name("requestNotificationPermission"), object: nil)
    NotificationCenter.default.addObserver(
      self, selector: #selector(setAppVisibility), name: NSNotification.Name("setAppVisibility"),
      object: nil)
    NotificationCenter.default.addObserver(
      self, selector: #selector(handleNew4WeeksWorklogOverview),
      name: NSNotification.Name("new4WeeksWorklogOverview"), object: nil)

    // Enable notifications when the app is focused
    UNUserNotificationCenter.current().delegate = self

    // Assign the new handler for deep links
    let em = NSAppleEventManager.shared()
    em.setEventHandler(
      self, andSelector: #selector(getUrl(_:withReplyEvent:)),
      forEventClass: AEEventClass(kInternetEventClass), andEventID: AEEventID(kAEGetURL))

    let jsCodeLocation: URL = self.bundleURL()
    let rootView = RCTRootView(
      bundleURL: jsCodeLocation, moduleName: "Chronos", initialProperties: nil, launchOptions: nil)
    let rootViewController = NSViewController()
    rootViewController.view = rootView

    // Create the application window
    windowController.window!.contentViewController = rootViewController
    let screen = NSScreen.main!
    let midScreenX = screen.frame.midX
    let posScreenY = 200
    let origin = CGPoint(x: Int(midScreenX), y: posScreenY)
    let size = CGSize(width: 460, height: 548)
    let frame = NSRect(origin: origin, size: size)

    windowController.window?.setFrame(frame, display: true)
    windowController.window?.center()
    self.window = self.windowController.window!
    windowController.window?.makeKeyAndOrderFront(self)

    return super.applicationDidFinishLaunching(notification)
  }

  //
  // Add sourceURLForBridge function to get the current bundle location (needed for the bridge)
  //

  override func sourceURL(for bridge: RCTBridge) -> URL {
    return self.bundleURL()
  }

  override func bundleURL() -> URL {
    #if DEBUG
      return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")!
    #else
      return Bundle.main.url(forResource: "main", withExtension: "jsbundle")!
    #endif
  }

  //
  // Reopen window on dock icon click
  //

  override func applicationShouldHandleReopen(_ sender: NSApplication, hasVisibleWindows flag: Bool)
    -> Bool
  {
    windowController.window?.makeKeyAndOrderFront(self)
    return true
  }

  //
  // The actions for the menubar items
  //

  @IBAction func openGitHubURL(_ sender: AnyObject) {
    let url = URL(string: "https://github.com/nice-af/chronos-app")
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
  // Toggle the app icon visibility
  //

  @objc func setAppVisibility(notification: NSNotification) {
    guard let appIconSetting = notification.object as? String else {
      print("Notification object is not a string")
      return
    }

    if appIconSetting == "both" || appIconSetting == "menuBarOnly" {
      statusBarManager.showStatusBar()
    } else {
      statusBarManager.hideStatusBar()
    }

    if appIconSetting == "both" || appIconSetting == "dockOnly" {
      DispatchQueue.main.async {
        NSApp.setActivationPolicy(.regular)
      }
    } else {
      DispatchQueue.main.async {
        NSApp.setActivationPolicy(.accessory)
      }
    }
  }

  //
  // Listen to notification event
  //

  let un = UNUserNotificationCenter.current()
  struct TrackingReminderData: Codable {
    let title: String
    let message: String
  }

  @objc func checkNotificationPermissions() {
    un.requestAuthorization(options: [.alert, .sound]) { authorized, _ in
      if authorized {
        EventEmitter.sharedInstance.dispatch(name: "checkNotificationPermission", body: "granted")
      } else {
        EventEmitter.sharedInstance.dispatch(name: "checkNotificationPermission", body: "denied")
      }
    }
  }

  @objc func sendNotification(notification: NSNotification) {
    checkNotificationPermissions()
    guard let jsonString = notification.object as? String else {
      print("Reminder notification object is not a string")
      return
    }
    let jsonData = jsonString.data(using: .utf8)!
    let data: TrackingReminderData = try! JSONDecoder().decode(
      TrackingReminderData.self, from: jsonData)

    un.getNotificationSettings { settings in
      if settings.authorizationStatus == .authorized {
        let content = UNMutableNotificationContent()
        content.title = data.title
        content.body = data.message

        let currentDate = Date()
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd_HH-mm"
        let dateString = formatter.string(from: currentDate)
        let id = "ChronosReminder_" + dateString

        let trigger = UNTimeIntervalNotificationTrigger(timeInterval: 1, repeats: false)
        let request = UNNotificationRequest(identifier: id, content: content, trigger: trigger)
        self.un.add(request) { error in
          if error != nil { print(error?.localizedDescription as Any) }
        }
      }
    }
  }

  //
  // Store 4 weeks worklog overview JSON in app group
  //
  @objc func handleNew4WeeksWorklogOverview(notification: NSNotification) {
    guard let jsonString = notification.object as? String else {
      print("new4WeeksWorklogOverview object is not a string")
      return
    }
    let appGroup = "group.adrianfahrbach.chronos"
    if let userDefaults = UserDefaults(suiteName: appGroup) {
      userDefaults.set(jsonString, forKey: "FourWeeksWorklogOverview")
      userDefaults.synchronize()
      WidgetCenter.shared.reloadTimelines(ofKind: "ChronosWidget4WeeksOverview")
    } else {
      print("Failed to get UserDefaults for app group: \(appGroup)")
    }
  }

  //
  // Handle deep links
  //
  @objc public func getUrl(
    _ event: NSAppleEventDescriptor, withReplyEvent reply: NSAppleEventDescriptor
  ) {
    return RCTLinkingManager.getUrlEventHandler(event, withReplyEvent: reply)
  }
}

// Enable notifications when the app is focused
extension AppDelegate: UNUserNotificationCenterDelegate {
  func userNotificationCenter(
    _ center: UNUserNotificationCenter, willPresent notification: UNNotification,
    withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void
  ) {
    return completionHandler([.banner, .sound])
  }
}
