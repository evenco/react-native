/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "ARTAngularGradient.h"

#import <React/RCTLog.h>

#import "RCTConvert+ART.h"

const CGFloat ANGLE_OFFSET = -M_PI_2;
const NSInteger SEGMENT_COUNT = 360;
const CGFloat SEGMENT_OVERLAP = (1.0 / SEGMENT_COUNT) / 2;

@implementation ARTAngularGradient
{
  CGPoint _centerPoint;
  NSArray<UIColor *> *_colors;
  NSArray<NSNumber *> *_locations;
}

- (instancetype)initWithArray:(NSArray<NSNumber *> *)array
{
  if ((self = [super initWithArray:array])) {
    if (array.count < 5) {
      RCTLogError(@"-[%@ %@] expects 3 elements, received %@",
                  self.class, NSStringFromSelector(_cmd), array);
      return nil;
    }
    _centerPoint = [RCTConvert CGPoint:array offset:1];

    NSArray *colorsAndLocations = [array subarrayWithRange:NSMakeRange(3, array.count - 3)];
    NSInteger stops = colorsAndLocations.count / (4 + 1);
    _locations = [colorsAndLocations subarrayWithRange:NSMakeRange(stops * 4, stops)];

    NSArray<NSNumber *> *colorComponents = [colorsAndLocations subarrayWithRange:NSMakeRange(0, stops * 4)];
    NSMutableArray<UIColor *> *colors = [NSMutableArray arrayWithCapacity:stops];
    for (NSInteger i = 0; i < stops; i++) {
      CGFloat r = colorComponents[i * 4 + 0].floatValue;
      CGFloat g = colorComponents[i * 4 + 1].floatValue;
      CGFloat b = colorComponents[i * 4 + 2].floatValue;
      CGFloat a = colorComponents[i * 4 + 3].floatValue;
      colors[i] = [UIColor colorWithRed:r green:g blue:b alpha:a];
    }
    _colors = colors;
  }
  return self;
}

- (UIColor *)blendColor:(UIColor *)c1 with:(UIColor *)c2 amount:(CGFloat)alpha2 {
  CGFloat beta = 1.0 - alpha2;
  CGFloat r1, g1, b1, a1, r2, g2, b2, a2;
  [c1 getRed:&r1 green:&g1 blue:&b1 alpha:&a1];
  [c2 getRed:&r2 green:&g2 blue:&b2 alpha:&a2];
  CGFloat r = r1 * beta + r2 * alpha2;
  CGFloat g = g1 * beta + g2 * alpha2;
  CGFloat b = b1 * beta + b2 * alpha2;
  CGFloat a = a1 * beta + a2 * alpha2;
  return [UIColor colorWithRed:r green:g blue:b alpha:a];
}

- (UIColor *)colorForAngle:(CGFloat)angle {
  CGFloat position = angle / (M_PI * 2);

  NSInteger prevIndex = 0;
  NSInteger nextIndex = 0;
  CGFloat prevLocation = 0;
  CGFloat nextLocation = 1;
  for (NSInteger i = 1; i < _locations.count; i++) {
    CGFloat location = _locations[i].floatValue;
    CGFloat relative = location - position;
    if (relative <= 0 && relative >= (prevLocation - position)) {
      prevIndex = i;
      prevLocation = location;
    }
    if (relative >= 0 && relative <= (nextLocation - position)) {
      nextIndex = i;
      nextLocation = location;
    }
  }

  CGFloat prevLocationDistance = position - prevLocation;
  CGFloat nextLocationDistance = nextLocation - position;
  CGFloat fullDistance = prevLocationDistance + nextLocationDistance;
  CGFloat nextBlend = prevLocationDistance / fullDistance;
  UIColor *prevColor = _colors[prevIndex];
  UIColor *nextColor = _colors[nextIndex];
  return [self blendColor:prevColor with:nextColor amount:nextBlend];
}

- (void)paint:(CGContextRef)context {
  CGRect rect = CGContextGetClipBoundingBox(context);
  CGFloat radius = sqrtf(powf(_centerPoint.x, 2) + powf(_centerPoint.y, 2)); // HACK NO GOOD

  CGFloat segmentCount = 360; // TODO

  for (NSInteger i = 0; i < segmentCount - 1; i++) {
    CGContextSaveGState(context);

    CGFloat startAngle = (M_PI * 2) / segmentCount * i - SEGMENT_OVERLAP;
    CGFloat endAngle = (M_PI * 2) / segmentCount * (i + 1) + SEGMENT_OVERLAP;

    CGFloat arcStart = startAngle + ANGLE_OFFSET - SEGMENT_OVERLAP;
    CGFloat arcEnd = endAngle + ANGLE_OFFSET + SEGMENT_OVERLAP;
    CGContextMoveToPoint(context, _centerPoint.x, _centerPoint.y);
    CGContextAddArc(context, _centerPoint.x, _centerPoint.y, radius, arcStart, arcEnd, 0);
    CGContextClosePath(context);

    UIColor *color = [self colorForAngle:(startAngle + endAngle) / 2];
    CGContextClip(context);
    CGContextSetFillColorWithColor(context, color.CGColor);
    CGContextFillRect(context, rect);

    CGContextRestoreGState(context);
  }
}

@end
