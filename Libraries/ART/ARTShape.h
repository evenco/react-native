/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <Foundation/Foundation.h>

#import "ARTRenderable.h"

@interface ARTShape : ARTRenderable

@property (nonatomic, assign) CGPathRef d;

@property (nonatomic, assign) CGFloat evenStrokeLength;
@property (nonatomic, assign) CGFloat evenStrokeStart;
@property (nonatomic, assign) CGFloat evenStrokeEnd;

@end
