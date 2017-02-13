package com.facebook.react.animated;

import com.facebook.react.bridge.ReadableMap;

/**
 * Animated node that corresponds to {@code AnimatedInterpolation} from AnimatedImplementation.js, applied to RGB or RGBA values.
 *
 * Currently only a linear interpolation is supported on an input range of an arbitrary size.
 */
public class RGBAInterpolationAnimatedNode extends CompoundInterpolationAnimatedNode {

  public RGBAInterpolationAnimatedNode(ReadableMap config) {
    super(config);
  }

  @Override
  public double getFlattenedValue(double[] values) {
    double r = values[0];
    double g = values[1];
    double b = values[2];
    double a = values[3];

    return (
      ((int)a & 0xff) << 24 |
      ((int)r & 0xff) << 16 |
      ((int)g & 0xff) << 8 |
      ((int)b & 0xff)
    );
  }

}
