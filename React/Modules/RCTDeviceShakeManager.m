/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

// <Even>
// We factored this out of RCTDevMenu.m

#import "RCTDeviceShakeManager.h"

#import "RCTBridge.h"
#import "RCTEventDispatcher.h"
#import "RCTLog.h"
#import "RCTUtils.h"
#import "RCTDevMenu.h"

static NSString * const RCTDeviceShakeEvent = @"DeviceShake";

static NSTimeInterval shakeStart;

@implementation UIWindow (RNShakeEvent)

- (void)customMotionBegan:(__unused UIEventSubtype)motion withEvent:(UIEvent *)event {
  shakeStart = [NSDate timeIntervalSinceReferenceDate];
}

- (void)customMotionEnded:(__unused UIEventSubtype)motion withEvent:(UIEvent *)event {
  if (event.subtype == UIEventSubtypeMotionShake) {
    NSTimeInterval shakeDuration = [NSDate timeIntervalSinceReferenceDate] - shakeStart;
    if (shakeDuration < 0.01 /* simulator */ || shakeDuration > 0.5 /* 500ms */) {
      [[NSNotificationCenter defaultCenter] postNotificationName:RCTDeviceShakeNotification object:nil];
    }
  }
}

@end

@implementation RCTDeviceShakeManager

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

+ (void)initialize {
  RCTSwapInstanceMethods([UIWindow class], @selector(motionBegan:withEvent:), @selector(customMotionBegan:withEvent:));
  RCTSwapInstanceMethods([UIWindow class], @selector(motionEnded:withEvent:), @selector(customMotionEnded:withEvent:));
}

- (instancetype)init {
  if (self = [super init]) {
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(onDeviceShake:)
                                                 name:RCTDeviceShakeNotification
                                               object:nil];
  }
  return self;
}

- (void)dealloc {
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)onDeviceShake:(NSNotification *)notification {
  [_bridge.eventDispatcher sendDeviceEventWithName:RCTDeviceShakeEvent body:nil];
}

- (NSDictionary *)constantsToExport {
  return @{@"shakeEventName": RCTDeviceShakeEvent};
}

@end
