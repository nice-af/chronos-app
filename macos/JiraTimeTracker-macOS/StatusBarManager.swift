import SwiftUI

enum StatusBarState: String {
  case PAUSED = "paused"
  case RUNNING = "running"
}

struct JTTStatusItemView: View {
  @ObservedObject var jttData: JTTDataObserver
  
  var body: some View {
    HStack(spacing: -1) {
      Spacer()
      ZStack(alignment: .center) {
        UnevenRoundedRectangle(cornerRadii: RectangleCornerRadii(topLeading: 5, bottomLeading: 5))
          .fill(.tertiary)
          .frame(width: 18, height: 20)
        Image(systemName: self.jttData.state == StatusBarState.PAUSED ? "play.fill" : "pause.fill")
          .resizable()
          .frame(width: 9, height: 9)
          .position(x: 10.5, y: 11)
      }
      ZStack(alignment: .center) {
        UnevenRoundedRectangle(cornerRadii: RectangleCornerRadii(bottomTrailing: 6, topTrailing: 6))
          .inset(by: 2)
          .fill(.clear)
          .stroke(.tertiary, lineWidth: 2)
          .frame(width: 43, height: 22)
        Text(self.jttData.text).font(.system(size: 11, weight: .bold)).tag(2)
      }
      Spacer()
    }
  }
}

class JTTDataObserver: ObservableObject {
  @Published var text: String = "-:--";
  @Published var state: StatusBarState = StatusBarState.PAUSED
  
  public func setText(newText: String) -> Void {
    self.text = newText
  }
  
  public func setState(newState: StatusBarState) -> Void {
    self.state = newState
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
    // newStatusItem.button?.toolTip = "HEEELLLOOOO"
    newStatusItem.button?.action = #selector(toggleWindow(_:))
    
    // StatusItem is stored as a property.
    self.statusItem = newStatusItem
    
    super.init()
    
    // Set button target for selector to search in this file
    newStatusItem.button?.target = self
    self.statusItem = newStatusItem
    
    // Setup event listeners
    NotificationCenter.default.addObserver(self, selector: #selector(setText), name: NSNotification.Name("statusBarTextChange"), object: nil)
    NotificationCenter.default.addObserver(self, selector: #selector(setState), name: NSNotification.Name("statusBarStateChange"), object: nil)
  }
  
  @objc public func toggleWindow(_ sender: AnyObject?) {
    // EventEmitter.sharedInstance.dispatch(name: "onSessionConnect", body: "THIS IS THE BODY")
    if self.windowController.window!.isVisible {
      self.windowController.window!.close()
    } else {
      self.windowController.window!.makeKeyAndOrderFront(self)
    }
  }
  
  @objc func setText(notification: NSNotification) -> Void {
    guard let newText = notification.object as? String else {
      print("Notification object is not a string")
      return
    }
    DispatchQueue.main.async {
      self.jttData.setText(newText: newText)
    }
  }
  
  @objc func setState(notification: NSNotification) -> Void {
    guard let newState = notification.object as? String else {
      print("Notification object is not a string")
      return
    }
    if (newState == "paused") {
      DispatchQueue.main.async {
        self.jttData.setState(newState: StatusBarState.PAUSED)
      }
    }
    if (newState == "running") {
      DispatchQueue.main.async {
        self.jttData.setState(newState: StatusBarState.RUNNING)
      }
    }
  }
}
