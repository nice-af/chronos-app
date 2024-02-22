#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(MenubarManager, NSObject)

RCT_EXTERN_METHOD(setText:(NSString *)text)
RCT_EXTERN_METHOD(setState:(NSString *)state)

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

@end
