public class FullContentWindow: NSWindow {
  var buttonsShouldBeMoved: Bool = true;
  
  override public func standardWindowButton(_ b: NSWindow.ButtonType) -> NSButton? {
    switch b {
    case .closeButton:
      moveButton(ofType: b)
      if buttonsShouldBeMoved == true {
        // moveButton(ofType: b)
      }
    default:
      break
    }
    
    return super.standardWindowButton(b)
  }
  
  public override func layoutIfNeeded() {
    super.layoutIfNeeded()
    moveButton(ofType: .closeButton)
    if buttonsShouldBeMoved == true {
      // moveButton(ofType: .closeButton)
    }
  }
  
  public func windowWillEnterFullScreen(_ notification: Notification) {
    buttonsShouldBeMoved = false
  }
  
  public func windowWillExitFullScreen(_ notification: Notification) {
    buttonsShouldBeMoved = true
  }
  
  
  func moveButton(ofType type: NSWindow.ButtonType) {
    
    guard let button = super.standardWindowButton(type) else {
      return
    }
    
    switch type {
    case .closeButton:
      let windowControls = button.superview!
      let titlebarContainer = windowControls.superview!
      let realTitlebar = titlebarContainer.superview!
      print(realTitlebar)
      print(super.frame.width)
      //.trackingAreas.forEach { area in
      //  print(area.rect.width, area.rect.height)
      //}
      // print(realTitlebar.trackingAreas)
      // windowControls.removeFromSuperview()
      // windowControls.setFrameOrigin(NSMakePoint(10, -30))
      // windowControls.layer?.backgroundColor = CGColor(red: 255, green: 0, blue: 0, alpha: 1)
      // titlebarContainer.layer?.backgroundColor = CGColor(red: 0, green: 255, blue: 0, alpha: 1)
      
      // realTitlebar.subviews[0].layer?.backgroundColor = CGColor(red: 0, green: 0, blue: 255, alpha: 1)
      // realTitlebar.subviews[1].layer?.backgroundColor = CGColor(red: 0, green: 0, blue: 0, alpha: 0.5)
      // realTitlebar.subviews[2].layer?.backgroundColor = CGColor(red: 255, green: 255, blue: 255, alpha: 0.5)
      
      titlebarContainer.setFrameSize(NSSize(width: super.frame.size.width, height: 52))
      titlebarContainer.setFrameOrigin(NSPoint(x: 0, y: super.frame.size.height - 52))
      
      windowControls.setFrameOrigin(NSPoint(x: 12, y: -16))
      windowControls.setFrameSize(NSSize(width: super.frame.size.width - 12, height: 52))
      
      if (realTitlebar.trackingAreas.count >= 5) {
        let trackingArea = realTitlebar.trackingAreas[4]
        print(trackingArea)
        // realTitlebar.removeTrackingArea(trackingArea)
        let newTrackingAreaRect = NSRect(x: trackingArea.rect.origin.x, y: trackingArea.rect.origin.x + 30, width: trackingArea.rect.width, height: 20)
        let newTrackingArea = NSTrackingArea(rect:newTrackingAreaRect , options: trackingArea.options, owner: trackingArea.owner, userInfo: trackingArea.userInfo )
        realTitlebar.updateTrackingAreas()
        realTitlebar.updateLayer()
        realTitlebar.updateConstraints()
        // realTitlebar.addTrackingArea(newTrackingArea)
      }
      
      print("windowControls", windowControls.trackingAreas.count)
      print("titlebar", titlebarContainer.trackingAreas.count)
      print("--------")
      
      // windowControls.setFrameSize(NSSize(width: 100, height: 52))
      // superSuperView!.setFrameSize(NSSize(width: (superSuperView?.layer?.frame.width)!, height: 52))
      // superSuperSuperView!.setFrameSize(NSSize(width: 200, height: 100))
      // superSuperView!.setFrameOrigin(NSMakePoint(10, super.frame.size.height - 40))
      // superSuperView!.addSubview(windowControls)
      
      // button.superview?.updateTrackingAreas()
      // let trackingArea = (button.superview?.trackingAreas[0])!;
      // button.superview?.removeTrackingArea(trackingArea)
      // let newTrackingAreaRect = NSRect(x: trackingArea.rect.origin.x+50, y: trackingArea.rect.origin.x+50, width: trackingArea.rect.width+200, height: trackingArea.rect.height)
      // let newTrackingArea = NSTrackingArea(rect:newTrackingAreaRect , options: trackingArea.options, owner: trackingArea.owner, userInfo: trackingArea.userInfo )
      // button.superview?.addTrackingArea(newTrackingArea)
      
    default:
      break
    }
  }
}
