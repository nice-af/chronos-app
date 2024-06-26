import SwiftUI

enum StatusBarState: String {
  case PAUSED = "paused"
  case RUNNING = "running"
}

struct StateChangeData: Codable {
  let state: String
  let issueKey: String?
  let issueSummary: String?
}

struct JTTStatusItemView: View {
  @ObservedObject var jttData: JTTDataObserver
  
  var body: some View {
    HStack(spacing: -1) {
      Spacer()
      ZStack(alignment: .center) {
        UnevenRoundedRectangle(cornerRadii: RectangleCornerRadii(topLeading: 5, bottomLeading: 5))
          .fill(.foreground)
          .frame(width: 18, height: 20)
          .opacity(0.25)
        Image(systemName: self.jttData.state == StatusBarState.PAUSED ? "play.fill" : "pause.fill")
          .resizable()
          .frame(width: 9, height: 9)
          .position(x: 10.5, y: 11)
        Rectangle()
          .fill(.clear)
          .contentShape(Rectangle())
          .frame(width: 18, height: 18)
          .position(x: 10, y: 11)
          .onTapGesture {
            EventEmitter.sharedInstance.dispatch(name: "playPauseClick", body: self.jttData.state == StatusBarState.PAUSED ? "paused" : "running")
          }
      }
      ZStack(alignment: .center) {
        UnevenRoundedRectangle(cornerRadii: RectangleCornerRadii(bottomTrailing: 6, topTrailing: 6))
          .inset(by: 2)
          .fill(.clear)
          .stroke(.foreground, lineWidth: 2)
          .frame(width: 43, height: 22)
          .opacity(0.25)
        Text(self.jttData.timeString).font(.system(size: 11, weight: .bold))
      }
      Spacer()
    }
  }
}

class JTTDataObserver: ObservableObject {
  @Published var time: Int? = nil;
  @Published var timeString: String = "-:--";
  @Published var state: StatusBarState = StatusBarState.PAUSED
  var timer = Timer()
  
  func formatTime(time: Int) -> String {
    let minutes = time / 60 % 60
    let hours = time / 3600
    return String(format: "%d:%02d", hours, minutes)
  }
  
  func startTimer() {
    self.timer.invalidate()
    var previousTime = (self.time ?? 0)
    self.timer = Timer.scheduledTimer(withTimeInterval: 60, repeats: true) { _ in
      let newTime = previousTime + 60
      previousTime = newTime
      self.time = newTime
      self.timeString = self.formatTime(time: newTime)
    }
  }
  
  func stopTimer() {
    self.timer.invalidate()
  }
  
  public func setTime(newTime: String) -> Void {
    if (newTime == "null") {
      self.time = nil
      self.timeString = "-:--"
    } else {
      self.time = (newTime as NSString) .integerValue
    }
  }
  
  public func setState(newState: StatusBarState) -> Void {
    self.state = newState
    if (newState == StatusBarState.RUNNING) {
      self.startTimer()
      self.timeString = self.formatTime(time: self.time ?? 0)
    } else {
      self.stopTimer()
    }
  }
}

class StatusBarManager: NSObject {
  @ObservedObject var jttData: JTTDataObserver
  var statusItem: NSStatusItem?
  var windowController: CustomWindowController
  var rootView: JTTStatusItemView?
  
  init(newWindowController: CustomWindowController) {
    let newJTTData = JTTDataObserver()
    self.jttData = newJTTData
    self.rootView = JTTStatusItemView(jttData: newJTTData)
    self.windowController = newWindowController
    
    // Adding content view to the status bar
    let newStatusItem = NSStatusBar.system.statusItem(withLength: NSStatusItem.variableLength)
    
    // Status bar icon SwiftUI view & a hosting view.
    let subView = NSHostingView(rootView: self.rootView)
    subView.frame = NSRect(x: 0, y: 0, width: 70, height: 22)
    
    // Adding the status bar view
    newStatusItem.button?.addSubview(subView)
    newStatusItem.button?.frame = subView.frame
    newStatusItem.button?.action = #selector(toggleWindow(_:))
    
    // StatusItem is stored as a property.
    self.statusItem = newStatusItem
    
    super.init()
    
    // Set button target for selector to search in this file
    newStatusItem.button?.target = self
    self.statusItem = newStatusItem
    
    // Setup event listeners
    NotificationCenter.default.addObserver(self, selector: #selector(setTime), name: NSNotification.Name("statusBarTimeChange"), object: nil)
    NotificationCenter.default.addObserver(self, selector: #selector(setState), name: NSNotification.Name("statusBarStateChange"), object: nil)
  }
  
  @objc public func toggleWindow(_ sender: AnyObject?) {
    if self.windowController.window!.isKeyWindow {
      self.windowController.window!.close()
    } else {
      self.windowController.window!.makeKeyAndOrderFront(self)
      NSApplication.shared.activate(ignoringOtherApps: true)
    }
  }
  
  @objc func setTime(notification: NSNotification) -> Void {
    guard let newTime = notification.object as? String else {
      print("Notification object is not a string")
      return
    }
    DispatchQueue.main.async {
      self.jttData.setTime(newTime: newTime)
    }
  }
  
  @objc func setState(notification: NSNotification) -> Void {
    guard let jsonString = notification.object as? String else {
      print("Notification object is not a string")
      return
    }
    let jsonData = jsonString.data(using: .utf8)!
    let data: StateChangeData = try! JSONDecoder().decode(StateChangeData.self, from: jsonData)
    
    if (data.state == "paused") {
      DispatchQueue.main.async {
        self.statusItem?.button?.toolTip = nil
        self.jttData.setState(newState: StatusBarState.PAUSED)
      }
    }
    if (data.state == "running") {
      DispatchQueue.main.async {
        if (data.issueKey != nil && data.issueSummary != nil){
          self.statusItem?.button?.toolTip = "\((data.issueKey != nil) ? "\(data.issueKey ?? ""):" : "") \(data.issueSummary ?? "")"
        }
        self.jttData.setState(newState: StatusBarState.RUNNING)
      }
    }
  }
}
