public class CustomWindow: NSWindow {
  var buttonsShouldBeMoved: Bool = true;
  var titlebarAccessory: NSTitlebarAccessoryViewController
  
  override init(contentRect: NSRect, styleMask style: NSWindow.StyleMask, backing backingStoreType: NSWindow.BackingStoreType, defer flag: Bool) {
    self.titlebarAccessory = NSTitlebarAccessoryViewController()
    
    // Init window with basic settings
    let rect = NSRect(x: 0, y: 0, width: 460, height: 507)
    super.init(contentRect: rect, styleMask: [.titled, .closable, .miniaturizable, .resizable, .fullSizeContentView], backing: .buffered, defer: false)
    self.titlebarAppearsTransparent = true
    self.titleVisibility = .hidden
    self.setFrameAutosaveName("Jira Time Tracker Main Window")
    
    // Add titlebar accessory for larger drag area
    self.addTitlebarAccessoryViewController(titlebarAccessory)
  }
  
  public override func layoutIfNeeded() {
    self.setupButtons()
    super.layoutIfNeeded()
  }
  
  public func enterFullscreen() {
    self.buttonsShouldBeMoved = false
    self.removeTitlebarAccessoryViewController(at: 0)
  }
  
  public func exitFullscreen() {
    self.buttonsShouldBeMoved = true
    self.addTitlebarAccessoryViewController(titlebarAccessory)
  }
  
  public func setupButtons() {
    if (buttonsShouldBeMoved) {
      let windowControls = super.standardWindowButton(.closeButton)!.superview!
      let titlebarContainer = windowControls.superview!
      // windowControls.layer?.backgroundColor = CGColor(red: 255, green: 0, blue: 0, alpha: 1)
      // titlebarContainer.layer?.backgroundColor = CGColor(red: 0, green: 255, blue: 0, alpha: 1)
      
      titlebarContainer.setFrameSize(NSSize(width: super.frame.size.width, height: 52))
      titlebarContainer.setFrameOrigin(NSPoint(x: 0, y: super.frame.size.height - 52))
      
      windowControls.setFrameOrigin(NSPoint(x: 12, y: -16))
      windowControls.setFrameSize(NSSize(width: super.frame.size.width - 12, height: 52))
    }
  }
}
