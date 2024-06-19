import AuthenticationServices
import Foundation
import React

@objc(ReactNativeOAuthLogin)
class ReactNativeOAuthLogin: RCTEventEmitter, ASWebAuthenticationPresentationContextProviding {
  var webAuthSession: ASWebAuthenticationSession?
  
  override func supportedEvents() -> [String]? {
    return ["onOAuthLogin"]
  }
  
  func presentationAnchor(for session: ASWebAuthenticationSession) -> ASPresentationAnchor {
    return ASPresentationAnchor()
  }
  
  @objc(startSession:callbackURLScheme:)
  func startSession(url: String, callbackURLScheme: String) {
    guard let parsedUrl = URL(string: url) else {
      sendEvent(withName: "onOAuthLogin", body: ["error": "Invalid URL"])
      return
    }
    
    webAuthSession = ASWebAuthenticationSession(
      url: parsedUrl,
      callbackURLScheme: callbackURLScheme,
      completionHandler: { (callbackURL: URL?, error: Error?) in
        if let error = error {
          self.sendEvent(withName: "onOAuthLogin", body: ["error": error.localizedDescription])
        } else if let callbackURL = callbackURL {
          self.sendEvent(withName: "onOAuthLogin", body: ["url": callbackURL.absoluteString])
        }
      })
    
    webAuthSession?.presentationContextProvider = self
    webAuthSession?.prefersEphemeralWebBrowserSession = true
    DispatchQueue.main.async { self.webAuthSession?.start() }
  }
  
  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
