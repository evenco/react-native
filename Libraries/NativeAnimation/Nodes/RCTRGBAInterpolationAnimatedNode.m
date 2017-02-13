/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "RCTRGBAInterpolationAnimatedNode.h"

@implementation RCTRGBAInterpolationAnimatedNode

- (CGFloat)getFlattenedValue:(NSArray<NSNumber *> *)values
{
  int r = values[0].intValue;
  int g = values[1].intValue;
  int b = values[2].intValue;
  int a = values[3].intValue;

  return ((a & 0xff) << 24 |
          (r & 0xff) << 16 |
          (g & 0xff) << 8 |
          (b & 0xff));
}

@end
