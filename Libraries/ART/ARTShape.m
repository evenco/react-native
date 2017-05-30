/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "ARTShape.h"

#import "RCTConvert+ART.h"

@implementation ARTShape

- (void)setD:(CGPathRef)d
{
  if (d == _d) {
    return;
  }
  [self invalidate];
  CGPathRelease(_d);
  _d = CGPathRetain(d);
}

- (void)setEvenStrokeLength:(CGFloat)strokeLength {
  _evenStrokeLength = strokeLength;
  [self invalidate];
}

- (void)setEvenStrokeStart:(CGFloat)strokeStart {
  _evenStrokeStart = strokeStart;
  [self invalidate];
}

- (void)setEvenStrokeEnd:(CGFloat)strokeEnd {
  _evenStrokeEnd = strokeEnd;
  [self invalidate];
}

- (void)dealloc
{
  CGPathRelease(_d);
}

- (void)renderLayerTo:(CGContextRef)context
{
  if ((!self.fill && !self.stroke) || !self.d) {
    return;
  }
  
  // <Even>
  ARTCGFloatArray strokeDash = self.strokeDash;
  CGFloat strokeDashOffset = self.strokeDashOffset;
  if (self.evenStrokeLength) {
    CGFloat offsetFix = 10;
    CGFloat fullPathLength = self.evenStrokeLength;
    CGFloat pathOffset = self.evenStrokeStart * fullPathLength;
    CGFloat pathLength = self.evenStrokeEnd * fullPathLength - pathOffset;
    NSArray *arr = @[@(offsetFix), @(pathOffset), @(pathLength), @(NSIntegerMax)];
    strokeDash = [RCTConvert ARTCGFloatArrayForArray:arr];
    strokeDashOffset = offsetFix;
  }
  // </Even>

  BOOL needsFill = NO;
  if (self.fill) {
    if ([self.fill applyFillColor:context]) {
      needsFill = YES;
    } else {
      CGContextSaveGState(context);
      CGContextAddPath(context, self.d);
      CGContextClip(context);
      [self.fill paint:context];
      CGContextRestoreGState(context);
      if (!self.stroke) {
        return;
      }
    }
  }

  BOOL needsStroke = NO;
  if (self.stroke) {
    CGContextSetLineWidth(context, self.strokeWidth);
    CGContextSetLineCap(context, self.strokeCap);
    CGContextSetLineJoin(context, self.strokeJoin);
    ARTCGFloatArray dash = strokeDash;
    if (dash.count) {
      CGContextSetLineDash(context, strokeDashOffset, dash.array, dash.count);
    }
    if ([self.stroke applyStrokeColor:context]) {
      needsStroke = YES;
    } else {
      CGContextSaveGState(context);
      CGContextAddPath(context, self.d);
      CGContextReplacePathWithStrokedPath(context);
      CGContextClip(context);

      [self.stroke paint:context];
      CGContextRestoreGState(context);
    }
  }

  if (needsFill || needsStroke) {
    CGPathDrawingMode mode;
    if (needsFill && needsStroke) {
      mode = kCGPathFillStroke;
    } else if (needsFill) {
      mode = kCGPathFill;
    } else {
      mode = kCGPathStroke;
    }
    CGContextAddPath(context, self.d);
    CGContextDrawPath(context, mode);
  }
}

@end
