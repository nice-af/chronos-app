public class CustomWindow: NSWindow {
  var buttonsShouldBeMoved: Bool = true;
  
  override init(contentRect: NSRect, styleMask style: NSWindow.StyleMask, backing backingStoreType: NSWindow.BackingStoreType, defer flag: Bool) {
    let rect = NSRect(x: 0, y: 0, width: 460, height: 507)
    
    super.init(contentRect: rect, styleMask: [.titled, .closable, .miniaturizable, .resizable, .fullSizeContentView], backing: .buffered, defer: false)
    
    self.titlebarAppearsTransparent = true
    self.titleVisibility = .hidden
    self.setFrameAutosaveName("Jira Time Tracker Main Window")
    self.addTitlebarAccessoryViewController(NSTitlebarAccessoryViewController())
  }
  
  public override func layoutIfNeeded() {
    setupWindow()
    super.layoutIfNeeded()
  }
  
  public func windowWillEnterFullScreen(_ notification: Notification) {
    buttonsShouldBeMoved = false
  }
  
  public func windowWillExitFullScreen(_ notification: Notification) {
    buttonsShouldBeMoved = true
  }
  
  
  func setupWindow() {
    let windowControls = super.standardWindowButton(.closeButton)!.superview!
    let titlebarContainer = windowControls.superview!
    
    windowControls.layer?.backgroundColor = CGColor(red: 255, green: 0, blue: 0, alpha: 1)
    titlebarContainer.layer?.backgroundColor = CGColor(red: 0, green: 255, blue: 0, alpha: 1)
    
    titlebarContainer.setFrameSize(NSSize(width: super.frame.size.width, height: 52))
    titlebarContainer.setFrameOrigin(NSPoint(x: 0, y: super.frame.size.height - 52))
    
    windowControls.setFrameOrigin(NSPoint(x: 12, y: -16))
    windowControls.setFrameSize(NSSize(width: super.frame.size.width - 12, height: 52))
    
    
    // print("windowControls", windowControls.trackingAreas.count)
    // print("titlebar", titlebarContainer.trackingAreas.count)
    // print("--------")
    
  }
}
