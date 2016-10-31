//
//  RCTNativeAnimatedNodesManager.m
//  RCTAnimation
//
//  Created by Ryan Gomba on 10/31/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import "RCTNativeAnimatedNodesManager.h"

#import "RCTConvert.h"
#import "RCTAnimatedNode.h"
#import "RCTAnimationDriver.h"

#import "RCTAdditionAnimatedNode.h"
#import "RCTInterpolationAnimatedNode.h"
#import "RCTDiffClampAnimatedNode.h"
#import "RCTDivisionAnimatedNode.h"
#import "RCTModuloAnimatedNode.h"
#import "RCTMultiplicationAnimatedNode.h"
#import "RCTModuloAnimatedNode.h"
#import "RCTPropsAnimatedNode.h"
#import "RCTStyleAnimatedNode.h"
#import "RCTTransformAnimatedNode.h"
#import "RCTValueAnimatedNode.h"
#import "RCTFrameAnimation.h"
#import "RCTSpringAnimation.h"

@implementation RCTNativeAnimatedNodesManager
{
  RCTUIManager *_uiManager;
  NSMutableDictionary<NSNumber *, RCTAnimatedNode *> *_animationNodes;
  NSMutableSet<id<RCTAnimationDriver>> *_activeAnimations;
  CADisplayLink *_displayLink;
}

- (instancetype)initWithUIManager:(nonnull RCTUIManager *)uiManager
{
  if ((self = [super init])) {
    _uiManager = uiManager;
    _animationNodes = [NSMutableDictionary new];
    _activeAnimations = [NSMutableSet new];
  }
  return self;
}

- (void)createAnimatedNode:(nonnull NSNumber *)tag
                    config:(NSDictionary<NSString *, id> *)config
{
  static NSDictionary *map;
  static dispatch_once_t mapToken;
  dispatch_once(&mapToken, ^{
    map = @{@"style" : [RCTStyleAnimatedNode class],
            @"value" : [RCTValueAnimatedNode class],
            @"props" : [RCTPropsAnimatedNode class],
            @"interpolation" : [RCTInterpolationAnimatedNode class],
            @"addition" : [RCTAdditionAnimatedNode class],
            @"diffclamp": [RCTDiffClampAnimatedNode class],
            @"division" : [RCTDivisionAnimatedNode class],
            @"multiplication" : [RCTMultiplicationAnimatedNode class],
            @"modulus" : [RCTModuloAnimatedNode class],
            @"transform" : [RCTTransformAnimatedNode class]};
  });

  NSString *nodeType = [RCTConvert NSString:config[@"type"]];

  Class nodeClass = map[nodeType];
  if (!nodeClass) {
    RCTLogError(@"Animated node type %@ not supported natively", nodeType);
    return;
  }

  RCTAnimatedNode *node = [[nodeClass alloc] initWithTag:tag config:config];
  _animationNodes[tag] = node;
  [node setNeedsUpdate];
}

- (void)connectAnimatedNodes:(nonnull NSNumber *)parentTag
                    childTag:(nonnull NSNumber *)childTag
{
  RCTAssertParam(parentTag);
  RCTAssertParam(childTag);

  RCTAnimatedNode *parentNode = _animationNodes[parentTag];
  RCTAnimatedNode *childNode = _animationNodes[childTag];

  RCTAssertParam(parentNode);
  RCTAssertParam(childNode);

  [parentNode addChild:childNode];
  [childNode setNeedsUpdate];
}

- (void)disconnectAnimatedNodes:(nonnull NSNumber *)parentTag
                       childTag:(nonnull NSNumber *)childTag
{
  RCTAssertParam(parentTag);
  RCTAssertParam(childTag);

  RCTAnimatedNode *parentNode = _animationNodes[parentTag];
  RCTAnimatedNode *childNode = _animationNodes[childTag];

  RCTAssertParam(parentNode);
  RCTAssertParam(childNode);

  [parentNode removeChild:childNode];
  [childNode setNeedsUpdate];
}

- (void)startAnimatingNode:(nonnull NSNumber *)animationId
                   nodeTag:(nonnull NSNumber *)nodeTag
                    config:(NSDictionary<NSString *, id> *)config
               endCallback:(RCTResponseSenderBlock)callBack
{
  RCTValueAnimatedNode *valueNode = (RCTValueAnimatedNode *)_animationNodes[nodeTag];

  NSString *type = config[@"type"];
  id<RCTAnimationDriver>animationDriver;

  if ([type isEqual:@"frames"]) {
    animationDriver = [[RCTFrameAnimation alloc] initWithId:animationId
                                                     config:config
                                                    forNode:valueNode
                                                   callBack:callBack];

  } else if ([type isEqual:@"spring"]) {
    animationDriver = [[RCTSpringAnimation alloc] initWithId:animationId
                                                      config:config
                                                     forNode:valueNode
                                                    callBack:callBack];

  } else {
    RCTLogError(@"Unsupported animation type: %@", config[@"type"]);
    return;
  }

  [_activeAnimations addObject:animationDriver];
  [animationDriver startAnimation];
  [self startAnimation];
}

- (void)stopAnimation:(nonnull NSNumber *)animationId
{
  for (id<RCTAnimationDriver>driver in _activeAnimations) {
    if ([driver.animationId isEqual:animationId]) {
      [driver removeAnimation];
      [_activeAnimations removeObject:driver];
      break;
    }
  }
}

- (void)setAnimatedNodeValue:(nonnull NSNumber *)nodeTag
                       value:(nonnull NSNumber *)value
{
  RCTAnimatedNode *node = _animationNodes[nodeTag];
  if (![node isKindOfClass:[RCTValueAnimatedNode class]]) {
    RCTLogError(@"Not a value node.");
    return;
  }

  RCTValueAnimatedNode *valueNode = (RCTValueAnimatedNode *)node;
  valueNode.value = value.floatValue;
  [valueNode setNeedsUpdate];
}

- (void)setAnimatedNodeOffset:(nonnull NSNumber *)nodeTag
                       offset:(nonnull NSNumber *)offset
{
  RCTAnimatedNode *node = _animationNodes[nodeTag];
  if (![node isKindOfClass:[RCTValueAnimatedNode class]]) {
    RCTLogError(@"Not a value node.");
    return;
  }

  RCTValueAnimatedNode *valueNode = (RCTValueAnimatedNode *)node;
  [valueNode setOffset:offset.floatValue];
  [valueNode setNeedsUpdate];
}

- (void)flattenAnimatedNodeOffset:(nonnull NSNumber *)nodeTag
{
  RCTAnimatedNode *node = _animationNodes[nodeTag];
  if (![node isKindOfClass:[RCTValueAnimatedNode class]]) {
    RCTLogError(@"Not a value node.");
    return;
  }

  RCTValueAnimatedNode *valueNode = (RCTValueAnimatedNode *)node;
  [valueNode flattenOffset];
}

- (void)extractAnimatedNodeOffset:(nonnull NSNumber *)nodeTag
{
  RCTAnimatedNode *node = _animationNodes[nodeTag];

  if (![node isKindOfClass:[RCTValueAnimatedNode class]]) {
    RCTLogError(@"Not a value node.");
    return;
  }

  RCTValueAnimatedNode *valueNode = (RCTValueAnimatedNode *)node;
  [valueNode extractOffset];
}

- (void)connectAnimatedNodeToView:(nonnull NSNumber *)nodeTag
                          viewTag:(nonnull NSNumber *)viewTag
{
  RCTAnimatedNode *node = _animationNodes[nodeTag];
  if (viewTag && [node isKindOfClass:[RCTPropsAnimatedNode class]]) {
    [(RCTPropsAnimatedNode *)node connectToView:viewTag uiManager:_uiManager];
  }
  [node setNeedsUpdate];
}

- (void)disconnectAnimatedNodeFromView:(nonnull NSNumber *)nodeTag
                               viewTag:(nonnull NSNumber *)viewTag
{
  RCTAnimatedNode *node = _animationNodes[nodeTag];
  if (viewTag && node && [node isKindOfClass:[RCTPropsAnimatedNode class]]) {
    [(RCTPropsAnimatedNode *)node disconnectFromView:viewTag];
  }
}

- (void)dropAnimatedNode:(nonnull NSNumber *)tag
{
  RCTAnimatedNode *node = _animationNodes[tag];
  if (node) {
    [node detachNode];
    [_animationNodes removeObjectForKey:tag];
  }
}


#pragma mark -- Value updates

- (void)startListeningToAnimatedNodeValue:(nonnull NSNumber *)tag
                            valueObserver:(id<RCTValueAnimatedNodeObserver>)valueObserver
{
  RCTAnimatedNode *node = _animationNodes[tag];
  if (node && [node isKindOfClass:[RCTValueAnimatedNode class]]) {
    ((RCTValueAnimatedNode *)node).valueObserver = valueObserver;
  }
}

- (void)stopListeningToAnimatedNodeValue:(nonnull NSNumber *)tag
                           valueObserver:(id<RCTValueAnimatedNodeObserver>)valueObserver
{
  RCTAnimatedNode *node = _animationNodes[tag];
  if (node && [node isKindOfClass:[RCTValueAnimatedNode class]]) {
    ((RCTValueAnimatedNode *)node).valueObserver = valueObserver;
  }
}


#pragma mark -- Animation Loop

- (void)startAnimation
{
  if (!_displayLink && _activeAnimations.count > 0) {
    _displayLink = [CADisplayLink displayLinkWithTarget:self selector:@selector(stepAnimations)];
    [_displayLink addToRunLoop:[NSRunLoop mainRunLoop] forMode:NSRunLoopCommonModes];
  }
}

- (void)stepAnimations
{
  for (id<RCTAnimationDriver>animationDriver in _activeAnimations) {
    [animationDriver stepAnimation];
  }

  [self updateAnimations];

  for (id<RCTAnimationDriver>animationDriver in [_activeAnimations copy]) {
    if (animationDriver.animationHasFinished) {
      [animationDriver removeAnimation];
      [_activeAnimations removeObject:animationDriver];
    }
  }
  if (_activeAnimations.count == 0) {
    [_displayLink invalidate];
    _displayLink = nil;
  }
}


#pragma mark -- Updates

- (void)updateAnimations
{
  [_animationNodes enumerateKeysAndObjectsUsingBlock:^(NSNumber *key, RCTAnimatedNode *node, BOOL *stop) {
    if (node.needsUpdate) {
      [node updateNodeIfNecessary];
    }
  }];
}

@end
