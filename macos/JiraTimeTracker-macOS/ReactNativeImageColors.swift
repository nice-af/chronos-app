import Foundation
import ColorThiefSwift

@objc(ReactNativeImageColors)
open class ReactNativeImageColors: NSObject {
  
  @objc
  func getPrimaryColorFromImage(_ url: String, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
    guard let imageUrl = URL(string: url) else {
      reject("Invalid URL", "The provided URL is invalid", nil)
      return
    }
    guard let imageData = try? Data(contentsOf: imageUrl) else {
      reject("Download Error", "Unable to download image data from URL", nil)
      return
    }
    guard let image = UIImage(data: imageData) else {
      reject("Image Creation Error", "Unable to create image from data", nil)
      return
    }
    guard let color = ColorThief.getColor(from: image) else {
      reject("ColorThief Error", "Unable to get color from image", nil)
        return
    }
    resolve("rgb(\(color.r),\(color.g),\(color.b))")
  }
  
  @objc
  public static func requiresMainQueueSetup() -> Bool {
    return false
  }
}
