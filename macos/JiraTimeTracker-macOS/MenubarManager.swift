import SwiftUI

enum State: String {
  case paused = "paused"
  case running = "running"
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
        Image(systemName: self.jttData.state == State.paused ? "play.fill" : "pause.fill")
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
  @Published var text: String = "0:00";
  @Published var state: State = State.paused
  
  public func setText(newText: String) -> Void {
    self.text = newText
  }
  
  public func setState(newState: State) -> Void {
    self.state = newState
  }
}



@objc(MenubarManager)
class MenubarManager: NSObject {
  @ObservedObject var jttData: JTTDataObserver
  var statusItem: NSStatusItem!
  var windowController: CustomWindowController?
  
  let backgroundColorDark = NSColor(red: CGFloat(234), green: CGFloat(233), blue: CGFloat(238), alpha: CGFloat(0.3))
  let backgroundColorLight = NSColor(red: 0, green: 0, blue: 0, alpha: 0.2)
  let textColorDark = NSColor(red: 234, green: 233, blue: 238, alpha: 1)
  let textColorLight = NSColor(red: 234, green: 233, blue: 238, alpha: 1)
  
  
  override public init() {
    self.jttData = JTTDataObserver()
    super.init()
    self.addStatusItem()
  }
  
  @objc func addStatusItem() {
    // Adding content view to the status bar
    let newStatusItem = NSStatusBar.system.statusItem(withLength: NSStatusItem.variableLength)
    
    // Status bar icon SwiftUI view & a hosting view.
    let rootView = JTTStatusItemView(jttData: self.jttData)
    let subView = NSHostingView(rootView: rootView)
    subView.frame = NSRect(x: 0, y: 0, width: 72, height: 22)
    
    // Adding the status bar view
    newStatusItem.button?.addSubview(subView)
    newStatusItem.button?.frame = subView.frame
    newStatusItem.button?.action = #selector(toggleWindow)
    
    // StatusItem is stored as a property.
    self.statusItem = newStatusItem
  }
  
  public func setWindowController(newWindowController: CustomWindowController) {
    self.windowController = newWindowController;
  }
  
  @objc func toggleWindow() {
    if (self.statusItem.button != nil && self.windowController != nil) {
      if (self.windowController!.window!.isVisible) {
        self.windowController!.window!.close()
      } else {
        self.windowController!.window!.display();
        self.windowController!.window!.becomeKey();
      }
    }
  }
  
  @objc(setText:)
  func setText(newText: String) -> Void {
    NSLog(newText)
    jttData.setText(newText: newText)
  }
  
  @objc(setState:)
  func setState(newState: String) -> Void {
    if (newState == "paused") {
      jttData.setState(newState: State.paused)
    }
    if (newState == "running") {
      jttData.setState(newState: State.running)
    }
  }
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
