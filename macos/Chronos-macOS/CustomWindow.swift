public class CustomWindow: NSWindow {
  override public var canBecomeKey: Bool {
    return true
  }

  override init(
    contentRect: NSRect, styleMask style: NSWindow.StyleMask,
    backing backingStoreType: NSWindow.BackingStoreType, defer flag: Bool
  ) {
    // Init window with basic settings
    let rect = NSRect(x: 0, y: 0, width: 460, height: 507)
    super.init(
      contentRect: rect,
      styleMask: [.titled, .closable, .miniaturizable, .resizable, .fullSizeContentView],
      backing: .buffered, defer: false)
    self.titlebarAppearsTransparent = true
    self.titleVisibility = .hidden
    self.titlebarSeparatorStyle = .none
    self.backgroundColor = NSColor.clear

    self.setFrameAutosaveName("Chronos Main Window")
    self.minSize = NSSize(width: 420, height: 480)

    // Define behaviour when focusing throug the menubar
    self.collectionBehavior = [.moveToActiveSpace]

    // Listen to themeChanged event
    NotificationCenter.default.addObserver(
      self, selector: #selector(changeWindowTheme), name: NSNotification.Name("themeChanged"),
      object: nil)

    // Hide original traffic light buttons
    setOriginalTrafficLightButtonsVisibility(isVisible: false)
  }

  // We need to listen to the escape key shortcut here because it is reserved as cancelAction
  // That means that is usually closes native modals/overlays. Ours aren't native and therefore don't work with that.
  override public func keyDown(with event: NSEvent) {
    if Int(event.keyCode) == 53 {
      EventEmitter.sharedInstance.dispatch(name: "closeOverlay", body: "")
      EventEmitter.sharedInstance.dispatch(name: "closeModal", body: "")
    } else {
      super.keyDown(with: event)
    }
  }

  // Make the top part of the window draggable
  override public func mouseDown(with event: NSEvent) {
    let location = event.locationInWindow
    let windowHeight = self.frame.height
    if location.y >= windowHeight - 56 {
      self.performDrag(with: event)
    } else {
      super.mouseDown(with: event)
    }
  }

  // Adjust the theme of the window
  @objc func changeWindowTheme(notification: NSNotification) {
    guard let themeKey = notification.object as? String else {
      print("New theme key is not a string")
      return
    }
    DispatchQueue.main.async {
      self.appearance = NSAppearance(named: themeKey == "light" ? .aqua : .darkAqua)
    }
  }

  public func enterFullscreen() {
    setOriginalTrafficLightButtonsVisibility(isVisible: true)
  }

  public func exitFullscreen() {
    setOriginalTrafficLightButtonsVisibility(isVisible: false)
  }

  private func setOriginalTrafficLightButtonsVisibility(isVisible: Bool) {
    if let closeButton = standardWindowButton(.closeButton),
      let minimizeButton = standardWindowButton(.miniaturizeButton),
      let zoomButton = standardWindowButton(.zoomButton)
    {
      // Buttons can't be completely transparent since they automatically get disabled then
      closeButton.alphaValue = isVisible ? 1 : 0
      minimizeButton.alphaValue = isVisible ? 1 : 0
      zoomButton.alphaValue = isVisible ? 1 : 0
    }
  }
}
