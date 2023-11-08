public class CustomWindowController: NSWindowController {
  override public init(window: NSWindow?) {
    super.init(window: window)
  }
  
  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }
  
  
  public func windowWillEnterFullScreen(_ notification: Notification) {
     // fullContentWindow.titleBarAccessoryViewController.isHidden = true
     // titleOffsetConstraint.constant = 0
  }

  public  func windowWillExitFullScreen(_ notification: Notification) {
     // fullContentWindow.titleBarAccessoryViewController.isHidden = false
     // titleOffsetConstraint.constant = fullContentWindow.standardWindowButtonsRect.maxX
  }
  
  override public func windowDidLoad() {
    super.windowDidLoad()
  }

}
