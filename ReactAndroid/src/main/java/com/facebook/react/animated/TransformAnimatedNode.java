/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

package com.facebook.react.animated;

import com.facebook.react.bridge.JavaOnlyArray;
import com.facebook.react.bridge.JavaOnlyMap;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
<<<<<<< HEAD
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.uimanager.MatrixMathHelper;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

// <Even>
=======

import java.util.ArrayList;
import java.util.List;
>>>>>>> upstream/0.36-stable

/**
 * Native counterpart of transform animated node (see AnimatedTransform class in AnimatedImplementation.js)
 */
/* package */ class TransformAnimatedNode extends AnimatedNode {

<<<<<<< HEAD
  private final NativeAnimatedNodesManager mNativeAnimatedNodesManager;
  private final Map<String, Object> mPropMapping;

  TransformAnimatedNode(ReadableMap config, NativeAnimatedNodesManager nativeAnimatedNodesManager) {
    ReadableArray transforms = config.getArray("transforms");
    mPropMapping = new HashMap<>();
    for (int i = 0; i < transforms.size(); i++) {
      ReadableMap transform = transforms.getMap(i);
      String propKey = transform.getString("property");
      if (transform.hasKey("nodeTag")) {
        int nodeTag = transform.getInt("nodeTag");
        mPropMapping.put(propKey, nodeTag);

      } else if (transform.hasKey("static")) {
        switch (transform.getType("static")) {
          case Number:
            mPropMapping.put(propKey, transform.getDouble("static"));
            break;
          case String:
            mPropMapping.put(
              propKey,
              NativeAnimatedHelper.parseAngle(transform.getString("static")));
            break;
        }
=======
  private class TransformConfig {
    public String mProperty;
  }

  private class AnimatedTransformConfig extends TransformConfig {
    public int mNodeTag;
  }

  private class StaticTransformConfig extends TransformConfig {
    public double mValue;
  }

  private final NativeAnimatedNodesManager mNativeAnimatedNodesManager;
  private final List<TransformConfig> mTransformConfigs;

  TransformAnimatedNode(ReadableMap config, NativeAnimatedNodesManager nativeAnimatedNodesManager) {
    ReadableArray transforms = config.getArray("transforms");
    mTransformConfigs = new ArrayList<>(transforms.size());
    for (int i = 0; i < transforms.size(); i++) {
      ReadableMap transformConfigMap = transforms.getMap(i);
      String property = transformConfigMap.getString("property");
      String type = transformConfigMap.getString("type");
      if (type.equals("animated")) {
        AnimatedTransformConfig transformConfig = new AnimatedTransformConfig();
        transformConfig.mProperty = property;
        transformConfig.mNodeTag = transformConfigMap.getInt("nodeTag");
        mTransformConfigs.add(transformConfig);
      } else {
        StaticTransformConfig transformConfig = new StaticTransformConfig();
        transformConfig.mProperty = property;
        transformConfig.mValue = transformConfigMap.getDouble("value");
        mTransformConfigs.add(transformConfig);
>>>>>>> upstream/0.36-stable
      }
    }
    mNativeAnimatedNodesManager = nativeAnimatedNodesManager;
  }

  public void collectViewUpdates(JavaOnlyMap propsMap) {
<<<<<<< HEAD
    double[] matrix = MatrixMathHelper.createIdentity();

    // Convert each transform to a matrix and multiply them together.
    for (Map.Entry<String, Object> entry : mPropMapping.entrySet()) {
      Object entryValue = entry.getValue();
      String entryKey = entry.getKey();

      // Get the current value of the transform. Animated nodes will be an Integer
      // representing the node id and static values will be a Double.
      double transformValue = -1;
      if (entryValue instanceof Integer) {
        AnimatedNode node = mNativeAnimatedNodesManager.getNodeById((Integer) entryValue);
        if (node == null) {
          throw new IllegalArgumentException("Mapped style node does not exists");
        } else if (node instanceof ValueAnimatedNode) {
          transformValue = ((ValueAnimatedNode) node).mValue;
=======
    List<JavaOnlyMap> transforms = new ArrayList<>(mTransformConfigs.size());

    for (TransformConfig transformConfig : mTransformConfigs) {
      double value;
      if (transformConfig instanceof AnimatedTransformConfig) {
        int nodeTag = ((AnimatedTransformConfig) transformConfig).mNodeTag;
        AnimatedNode node = mNativeAnimatedNodesManager.getNodeById(nodeTag);
        if (node == null) {
          throw new IllegalArgumentException("Mapped style node does not exists");
        } else if (node instanceof ValueAnimatedNode) {
          value = ((ValueAnimatedNode) node).mValue;
>>>>>>> upstream/0.36-stable
        } else {
          throw new IllegalArgumentException("Unsupported type of node used as a transform child " +
            "node " + node.getClass());
        }
      } else {
<<<<<<< HEAD
        transformValue = (double) entryValue;
      }

      // TODO: Optimise these matrix maths to avoid allocations for each transform.
      switch(entryKey) {
        case "scaleX":
          matrix = MatrixMathHelper.multiply(
            MatrixMathHelper.createScale3d(transformValue, 1, 1), matrix);
          break;
        case "scaleY":
          matrix = MatrixMathHelper.multiply(
            MatrixMathHelper.createScale3d(1, transformValue, 1), matrix);
          break;
        case "scale":
          matrix = MatrixMathHelper.multiply(
            MatrixMathHelper.createScale3d(transformValue, transformValue, 1), matrix);
          break;
        case "translateX":
          matrix = MatrixMathHelper.multiply(
            MatrixMathHelper.createTranslate3d(transformValue, 0, 0), matrix);
          break;
        case "translateY":
          matrix = MatrixMathHelper.multiply(
            MatrixMathHelper.createTranslate3d(0, transformValue, 0), matrix);
          break;
        case "rotate":
          matrix = MatrixMathHelper.multiply(
            MatrixMathHelper.createRotateZ(transformValue), matrix);
      }
    }

    // Box the double array to allow passing it as a JavaOnlyArray.
    ArrayList<Double> matrixList = new ArrayList<>(16);
    for (double ele : matrix) {
      matrixList.add(ele);
    }

    propsMap.putArray("transform", JavaOnlyArray.from(matrixList));
=======
        value = ((StaticTransformConfig) transformConfig).mValue;
      }

      transforms.add(JavaOnlyMap.of(transformConfig.mProperty, value));
    }

    propsMap.putArray("transform", JavaOnlyArray.from(transforms));
>>>>>>> upstream/0.36-stable
  }
}
