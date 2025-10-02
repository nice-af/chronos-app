import Foundation
import React

@objc(TrafficLightManager)
class TrafficLightManager: NSObject {

  @objc
  func closeWindow() {
    DispatchQueue.main.async {
      if let window = NSApp.mainWindow {
        window.close()
      }
    }
  }
  
  @objc
  func minimizeWindow() {
    DispatchQueue.main.async {
      if let window = NSApp.mainWindow {
        window.miniaturize(nil)
      }
    }
  }
  
  @objc 
  func toggleFullscreen() {
    DispatchQueue.main.async {
      if let window = NSApp.mainWindow {
        window.toggleFullScreen(nil)
      }
    }
  }
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
