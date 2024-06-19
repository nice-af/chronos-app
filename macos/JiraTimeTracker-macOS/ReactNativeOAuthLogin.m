#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(ReactNativeOAuthLogin, RCTEventEmitter)

RCT_EXTERN_METHOD(startSession:(NSString *)url callbackURLScheme:(NSString *)callbackURLScheme)

@end
