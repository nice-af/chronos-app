#import "BackgroundViewManager.h"
#import "BackgroundView.h"
#import <React/RCTBridge.h>

@implementation BackgroundViewManager

RCT_EXPORT_MODULE();
RCT_EXPORT_VIEW_PROPERTY(blendingMode, BOOL)
RCT_EXPORT_VIEW_PROPERTY(material, int)

@synthesize bridge = _bridge;

- (NSView *)view
{
  return [[BackgroundView alloc] init];
}

@end
