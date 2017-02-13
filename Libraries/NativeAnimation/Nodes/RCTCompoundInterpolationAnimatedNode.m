/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "RCTCompoundInterpolationAnimatedNode.h"
#import "RCTAnimationUtils.h"

@implementation RCTCompoundInterpolationAnimatedNode
{
    __weak RCTValueAnimatedNode *_parentNode;
    NSArray<NSNumber *> *_inputRange;
    NSArray<NSArray<NSNumber *> *> *_outputRange;
    NSString *_extrapolateLeft;
    NSString *_extrapolateRight;
}

- (instancetype)initWithTag:(NSNumber *)tag
                     config:(NSDictionary<NSString *, id> *)config
{
    if ((self = [super initWithTag:tag config:config])) {
        _inputRange = [config[@"inputRange"] copy];
        NSMutableArray *outputRange = [NSMutableArray array];
        for (id value in config[@"outputRange"]) {
            NSMutableArray *outputRangeNumbers = [NSMutableArray array];
            for (id valueNumber in value) {
                if ([valueNumber isKindOfClass:[NSNumber class]]) {
                    [outputRangeNumbers addObject:valueNumber];
                }
            }
            [outputRange addObject:outputRangeNumbers];
        }
        _outputRange = [outputRange copy];
        _extrapolateLeft = config[@"extrapolateLeft"];
        _extrapolateRight = config[@"extrapolateRight"];
    }
    return self;
}

- (void)onAttachedToNode:(RCTAnimatedNode *)parent
{
    [super onAttachedToNode:parent];
    if ([parent isKindOfClass:[RCTValueAnimatedNode class]]) {
        _parentNode = (RCTValueAnimatedNode *)parent;
    }
}

- (void)onDetachedFromNode:(RCTAnimatedNode *)parent
{
    [super onDetachedFromNode:parent];
    if (_parentNode == parent) {
        _parentNode = nil;
    }
}

- (NSUInteger)findIndexOfNearestValue:(CGFloat)value
                              inRange:(NSArray<NSNumber *> *)range
{
    NSUInteger index;
    NSUInteger rangeCount = range.count;
    for (index = 1; index < rangeCount - 1; index++) {
        NSNumber *inputValue = range[index];
        if (inputValue.doubleValue >= value) {
            break;
        }
    }
    return index - 1;
}

- (CGFloat)getFlattenedValue:(NSArray<NSNumber *> *)values
{
    @throw [NSException exceptionWithName:NSInternalInconsistencyException
                                   reason:[NSString stringWithFormat:@"You must override %@ in a subclass", NSStringFromSelector(_cmd)]
                                 userInfo:nil];
}

- (void)performUpdate
{
    [super performUpdate];
    if (!_parentNode) {
        return;
    }
    
    CGFloat inputValue = _parentNode.value;
    NSUInteger rangeIndex = [self findIndexOfNearestValue:inputValue inRange:_inputRange];
    NSNumber *inputMin = _inputRange[rangeIndex];
    NSNumber *inputMax = _inputRange[rangeIndex + 1];
    NSArray<NSNumber *> *outputMin = _outputRange[rangeIndex];
    NSArray<NSNumber *> *outputMax = _outputRange[rangeIndex + 1];
    
    self.value = [self getFlattenedValue:RCTCompoundInterpolateValue(inputValue,
                                                                     inputMin.doubleValue,
                                                                     inputMax.doubleValue,
                                                                     outputMin,
                                                                     outputMax,
                                                                     _extrapolateLeft,
                                                                     _extrapolateRight)];
}

@end
