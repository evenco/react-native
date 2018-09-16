/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "ARTShapeManager.h"

#import "ARTShape.h"
#import "RCTConvert+ART.h"

@implementation ARTShapeManager

RCT_EXPORT_MODULE()

- (ARTRenderable *)node
{
  return [ARTShape new];
}

RCT_EXPORT_VIEW_PROPERTY(d, CGPath)

RCT_EXPORT_VIEW_PROPERTY(evenStrokeLength, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(evenStrokeStart, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(evenStrokeEnd, CGFloat)

@end
