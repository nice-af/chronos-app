public class CustomWindowController: NSWindowController, NSWindowDelegate {
  private let customWindow: CustomWindow
  
  override public init(window: NSWindow?) {
    customWindow = CustomWindow()
    super.init(window: customWindow)
    customWindow.delegate = self
  }
  
  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }
 
  public func windowWillEnterFullScreen(_ notification: Notification) {
    print("fullscreen on")
    customWindow.enterFullscreen()
  }
  
  public  func windowWillExitFullScreen(_ notification: Notification) {
    print("fullscreen off")
    customWindow.exitFullscreen()
  }
}
