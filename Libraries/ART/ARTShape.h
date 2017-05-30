/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import <Foundation/Foundation.h>

#import "ARTRenderable.h"

@interface ARTShape : ARTRenderable

@property (nonatomic, assign) CGPathRef d;

@property (nonatomic, assign) CGFloat evenStrokeLength;
@property (nonatomic, assign) CGFloat evenStrokeStart;
@property (nonatomic, assign) CGFloat evenStrokeEnd;

@end
