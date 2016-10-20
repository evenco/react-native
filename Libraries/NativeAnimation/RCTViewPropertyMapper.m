/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "RCTViewPropertyMapper.h"

#import <UIKit/UIKit.h>

#import "RCTBridge.h"
#import "RCTConvert.h"
#import "RCTUIManager.h"
#import "RCTNativeAnimatedModule.h"

@interface RCTViewPropertyMapper ()

@property (nonatomic, weak) UIView *view;

@end

@implementation RCTViewPropertyMapper
{
  RCTNativeAnimatedModule *_animationModule;
}

- (instancetype)initWithViewTag:(NSNumber *)viewTag
                animationModule:(RCTNativeAnimatedModule *)animationModule
{
  if ((self = [super init])) {
    _animationModule = animationModule;
    _viewTag = viewTag;
    _animationModule = animationModule;
  }
  return self;
}

RCT_NOT_IMPLEMENTED(- (instancetype)init)

- (void)updateViewWithDictionary:(NSDictionary<NSString *, NSObject *> *)updates
{
  // <Even> we cache the view for perf reasons (avoid constant lookups)
  UIView *view = _view = _view ?: [_animationModule.bridge.uiManager viewForReactTag:_viewTag];
  if (!view) {
    return;
  }

  if (!updates.count) {
    return;
  }

  NSNumber *opacity = [RCTConvert NSNumber:updates[@"opacity"]];
  if (opacity) {
    view.alpha = opacity.floatValue;
  }

  NSObject *transform = updates[@"transform"];
  if ([transform isKindOfClass:[NSValue class]]) {
    view.layer.allowsEdgeAntialiasing = YES;
    view.layer.transform = ((NSValue *)transform).CATransform3DValue;
  }

  // <Even>
//  NSNumber *progress = (NSNumber *)updates[@"progress"];
//  if (progress) {
//    [(id)_view performSelector:@selector(setProgressValue:) withObject:progress];
//  }
  // TODO find a way to make something generic, like this, performant
  // [_animationModule.bridge.uiManager setProps:props forView:_viewTag];
  // </Even>
}

@end
