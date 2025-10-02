#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(TrafficLightManager, NSObject)

RCT_EXTERN_METHOD(closeWindow)
RCT_EXTERN_METHOD(minimizeWindow)
RCT_EXTERN_METHOD(toggleFullscreen)

@end
