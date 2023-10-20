#import "BackgroundViewManager.h"
#import "BackgroundView.h"
#import <React/RCTBridge.h>

@implementation BackgroundViewManager

RCT_EXPORT_MODULE();

@synthesize bridge = _bridge;

- (NSView *)view
{
  return [[BackgroundView alloc] init];
}

@end
