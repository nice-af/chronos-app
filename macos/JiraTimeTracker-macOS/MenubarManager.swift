import SwiftUI

enum MenubarState: String {
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
        Image(systemName: self.jttData.state == MenubarState.paused ? "play.fill" : "pause.fill")
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
  @Published var text: String = "INIT";
  @Published var state: MenubarState = MenubarState.paused

  public func setText(newText: String) -> Void {
    self.text = newText
  }
  
  public func setState(newState: MenubarState) -> Void {
    self.state = newState
  }
}



@objc(MenubarManager)
class MenubarManager: NSObject {
  @ObservedObject var jttData: JTTDataObserver
  var statusItem: NSStatusItem?
  var windowController: CustomWindowController?
  var rootView: JTTStatusItemView?
  
  override init() {
    print("MenubarManager init")
    let newJTTData = JTTDataObserver()
    self.jttData = newJTTData
    self.rootView = JTTStatusItemView(jttData: newJTTData)
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
  }
  
  public func setWindowController(newWindowController: CustomWindowController) {
    self.windowController = newWindowController;
  }
  
  @objc public func toggleWindow(_ sender: AnyObject?) {
    print("MenubarManager toggleWindow")
    if self.windowController!.window!.isMiniaturized {
      self.windowController!.window!.close()
    } else {
      self.windowController!.window!.display();
      self.windowController!.window!.becomeKey();
    }
    
  }
  
  @objc(setText:)
  func setText(newText: String) -> Void {
    jttData.setText(newText: newText)
  }
  
  @objc(setState:)
  func setState(newState: String) -> Void {
    if (newState == "paused") {
      jttData.setState(newState: MenubarState.paused)
    }
    if (newState == "running") {
      jttData.setState(newState: MenubarState.running)
    }
  }
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
