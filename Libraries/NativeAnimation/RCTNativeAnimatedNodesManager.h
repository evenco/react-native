//
//  RCTNativeAnimatedNodesManager.h
//  RCTAnimation
//
//  Created by Ryan Gomba on 10/31/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "RCTUIManager.h"
#import "RCTBridgeModule.h"
#import "RCTValueAnimatedNode.h"

@interface RCTNativeAnimatedNodesManager : NSObject

- (nonnull instancetype)initWithUIManager:(nonnull RCTUIManager *)uiManager;

- (void)updateAnimations;

// setup

- (void)createAnimatedNode:(nonnull NSNumber *)tag
                    config:(NSDictionary<NSString *, id> *__nonnull)config;

- (void)connectAnimatedNodes:(nonnull NSNumber *)parentTag
                    childTag:(nonnull NSNumber *)childTag;

- (void)disconnectAnimatedNodes:(nonnull NSNumber *)parentTag
                       childTag:(nonnull NSNumber *)childTag;

- (void)connectAnimatedNodeToView:(nonnull NSNumber *)nodeTag
                          viewTag:(nonnull NSNumber *)viewTag;

- (void)disconnectAnimatedNodeFromView:(nonnull NSNumber *)nodeTag
                               viewTag:(nonnull NSNumber *)viewTag;

- (void)dropAnimatedNode:(nonnull NSNumber *)tag;

// mutate

- (void)setAnimatedNodeValue:(nonnull NSNumber *)nodeTag
                       value:(nonnull NSNumber *)value;

- (void)setAnimatedNodeOffset:(nonnull NSNumber *)nodeTag
                       offset:(nonnull NSNumber *)offset;

- (void)flattenAnimatedNodeOffset:(nonnull NSNumber *)nodeTag;

- (void)extractAnimatedNodeOffset:(nonnull NSNumber *)nodeTag;

// drive

- (void)startAnimatingNode:(nonnull NSNumber *)animationId
                   nodeTag:(nonnull NSNumber *)nodeTag
                    config:(NSDictionary<NSString *, id> *__nonnull)config
               endCallback:(nullable RCTResponseSenderBlock)callBack;

- (void)stopAnimation:(nonnull NSNumber *)animationId;

// listen

- (void)startListeningToAnimatedNodeValue:(nonnull NSNumber *)tag
                            valueObserver:(nonnull id<RCTValueAnimatedNodeObserver>)valueObserver;

- (void)stopListeningToAnimatedNodeValue:(nonnull NSNumber *)tag
                           valueObserver:(nonnull id<RCTValueAnimatedNodeObserver>)valueObserver;

@end
