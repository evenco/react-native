/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

package com.facebook.react.animated;

import com.facebook.react.bridge.JSApplicationIllegalArgumentException;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableType;

import javax.annotation.Nullable;

/**
 * Animated node that corresponds to {@code AnimatedInterpolation} from AnimatedImplementation.js.
 *
 * Currently only a linear interpolation is supported on an input range of an arbitrary size.
 */
/*package*/ class InterpolationAnimatedNode extends ValueAnimatedNode {

  // <Even>
  public static final String EXTRAPOLATE_TYPE_IDENTITY = "identity";
  public static final String EXTRAPOLATE_TYPE_CLAMP = "clamp";
  public static final String EXTRAPOLATE_TYPE_EXTEND = "extend";
  // </Even>

  private static double[] fromArray(ReadableArray ary) {
    double[] res = new double[ary.size()];
    for (int i = 0; i < res.length; i++) {
      ReadableType type = ary.getType(i);
      if (type == ReadableType.Number) {
        res[i] = ary.getDouble(i);
      } else if (type == ReadableType.String) {
        res[i] = NativeAnimatedHelper.parseAngle(ary.getString(i));
      } else {
        throw new IllegalArgumentException(
          "Interpolation inputs and outputs must be a number or a string.");
      }

    }
    return res;
  }

  private static double interpolate(
      double value,
      double inputMin,
      double inputMax,
      double outputMin,
      double outputMax,
      String extrapolateLeft,
      String extrapolateRight) {
    // <Even> // backported from https://github.com/facebook/react-native/pull/9366
    double result = value;

    // Extrapolate
    if (result < inputMin) {
      switch (extrapolateLeft) {
        case EXTRAPOLATE_TYPE_IDENTITY:
          return result;
        case EXTRAPOLATE_TYPE_CLAMP:
          result = inputMin;
          break;
        case EXTRAPOLATE_TYPE_EXTEND:
          break;
        default:
          throw new JSApplicationIllegalArgumentException(
            "Invalid extrapolation type " + extrapolateLeft + "for left extrapolation");
      }
    }

    if (result > inputMax) {
      switch (extrapolateRight) {
        case EXTRAPOLATE_TYPE_IDENTITY:
          return result;
        case EXTRAPOLATE_TYPE_CLAMP:
          result = inputMax;
          break;
        case EXTRAPOLATE_TYPE_EXTEND:
          break;
        default:
          throw new JSApplicationIllegalArgumentException(
            "Invalid extrapolation type " + extrapolateRight + "for right extrapolation");
      }
    }
    // </Even>

    return outputMin + (outputMax - outputMin) *
      (result - inputMin) / (inputMax - inputMin);
  }

  /*package*/ static double interpolate(
      double value,
      double[] inputRange,
      double[] outputRange,
      String extrapolateLeft,
      String extrapolateRight) {
    int rangeIndex = findRangeIndex(value, inputRange);
    return interpolate(
      value,
      inputRange[rangeIndex],
      inputRange[rangeIndex + 1],
      outputRange[rangeIndex],
      outputRange[rangeIndex + 1],
      extrapolateLeft,
      extrapolateRight);
  }

  private static int findRangeIndex(double value, double[] ranges) {
    int index;
    for (index = 1; index < ranges.length - 1; index++) {
      if (ranges[index] >= value) {
        break;
      }
    }
    return index - 1;
  }

  private final double mInputRange[];
  private final double mOutputRange[];
  private final String mExtrapolateLeft;
  private final String mExtrapolateRight;
  private @Nullable ValueAnimatedNode mParent;

  public InterpolationAnimatedNode(ReadableMap config) {
    mInputRange = fromArray(config.getArray("inputRange"));
    mOutputRange = fromArray(config.getArray("outputRange"));
    mExtrapolateLeft = config.getString("extrapolateLeft");
    mExtrapolateRight = config.getString("extrapolateRight");
  }

  @Override
  public void onAttachedToNode(AnimatedNode parent) {
    if (mParent != null) {
      throw new IllegalStateException("Parent already attached");
    }
    if (!(parent instanceof ValueAnimatedNode)) {
      throw new IllegalArgumentException("Parent is of an invalid type");
    }
    mParent = (ValueAnimatedNode) parent;
  }

  @Override
  public void onDetachedFromNode(AnimatedNode parent) {
    if (parent != mParent) {
      throw new IllegalArgumentException("Invalid parent node provided");
    }
    mParent = null;
  }

  @Override
  public void update() {
    if (mParent == null) {
      throw new IllegalStateException("Trying to update interpolation node that has not been " +
        "attached to the parent");
    }
    mValue = interpolate(mParent.mValue, mInputRange, mOutputRange, mExtrapolateLeft, mExtrapolateRight);
  }
}
