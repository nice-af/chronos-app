public class CustomWindow: NSWindow {
  var buttonsShouldBeMoved: Bool = true;
  var titlebarAccessory: NSTitlebarAccessoryViewController
  
  override public var canBecomeKey: Bool {
      return true
  }
  
  override init(contentRect: NSRect, styleMask style: NSWindow.StyleMask, backing backingStoreType: NSWindow.BackingStoreType, defer flag: Bool) {
    self.titlebarAccessory = NSTitlebarAccessoryViewController()
    
    // Init window with basic settings
    let rect = NSRect(x: 0, y: 0, width: 460, height: 507)
    super.init(contentRect: rect, styleMask: [.titled, .closable, .miniaturizable, .resizable, .fullSizeContentView], backing: .buffered, defer: false)
    self.titlebarAppearsTransparent = true
    self.titleVisibility = .hidden
    self.setFrameAutosaveName("Chronos Main Window")
    self.minSize = NSSize(width: 420, height: 480)
    
    // Add titlebar accessory for larger drag area
    self.addTitlebarAccessoryViewController(titlebarAccessory)
    
    // Define behaviour when focusing throug the menubar
    self.collectionBehavior = [.moveToActiveSpace]
    
    // Listen to themeChanged event
    NotificationCenter.default.addObserver(self, selector: #selector(changeWindowTheme), name: NSNotification.Name("themeChanged"), object: nil)
    
    // Hide original traffic light buttons
    setOriginalTrafficLightButtonsVisibility(isVisible: false)
  }
  
  public override func layoutIfNeeded() {
    self.moveOriginalButtons()
    super.layoutIfNeeded()
  }
  
  // We need to listen to the escape key shortcut here because it is reserved as cancelAction
  // That means that is usually closes native modals/overlays. Ours aren't native and therefore don't work with that.
  override public func keyDown(with event: NSEvent) {
    if (Int(event.keyCode) == 53) {
      EventEmitter.sharedInstance.dispatch(name: "closeOverlay", body: "")
      EventEmitter.sharedInstance.dispatch(name: "closeModal", body: "")
    } else {
      super.keyDown(with: event)
    }
  }
  
  // Adjust the theme of the window
  @objc func changeWindowTheme(notification: NSNotification) -> Void {
    guard let themeKey = notification.object as? String else {
      print("New theme key is not a string")
      return
    }
    DispatchQueue.main.async {
      self.appearance = NSAppearance(named: themeKey == "light" ? .aqua : .darkAqua)
    }
  }
  
  public func enterFullscreen() {
    self.buttonsShouldBeMoved = false
    self.removeTitlebarAccessoryViewController(at: 0)
    setOriginalTrafficLightButtonsVisibility(isVisible: true)
  }
  
  public func exitFullscreen() {
    self.buttonsShouldBeMoved = true
    self.addTitlebarAccessoryViewController(titlebarAccessory)
    setOriginalTrafficLightButtonsVisibility(isVisible: false)
  }
  
  private func setOriginalTrafficLightButtonsVisibility(isVisible: Bool) {
    if let closeButton = standardWindowButton(.closeButton),
       let minimizeButton = standardWindowButton(.miniaturizeButton),
       let zoomButton = standardWindowButton(.zoomButton) {
      // Buttons can't be completely transparent since they automatically get disabled then
      closeButton.alphaValue = isVisible ? 1 : 0.0000001
      minimizeButton.alphaValue = isVisible ? 1 : 0.0000001
      zoomButton.alphaValue = isVisible ? 1 : 0.0000001
    }
  }
  
  public func moveOriginalButtons() {
    if (buttonsShouldBeMoved) {
      let windowControls = super.standardWindowButton(.closeButton)!.superview!
      let titlebarContainer = windowControls.superview!
      titlebarContainer.setFrameSize(NSSize(width: super.frame.size.width, height: 52))
      titlebarContainer.setFrameOrigin(NSPoint(x: 0, y: super.frame.size.height - 52))
      windowControls.setFrameOrigin(NSPoint(x: 12, y: -16))
      windowControls.setFrameSize(NSSize(width: super.frame.size.width, height: 52))
    }
  }
}
