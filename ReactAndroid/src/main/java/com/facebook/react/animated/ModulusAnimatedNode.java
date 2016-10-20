package com.facebook.react.animated;

import com.facebook.react.bridge.JSApplicationCausedNativeException;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;

// <Even>

/*package*/ class ModulusAnimatedNode extends ValueAnimatedNode {

  private final NativeAnimatedNodesManager mNativeAnimatedNodesManager;
  private final int inputNode;
  private final int modulus;

  public ModulusAnimatedNode(
      ReadableMap config,
      NativeAnimatedNodesManager nativeAnimatedNodesManager) {
    mNativeAnimatedNodesManager = nativeAnimatedNodesManager;
    inputNode = config.getInt("input");
    modulus = config.getInt("modulus");
  }

  @Override
  public void update() {
    AnimatedNode animatedNode = mNativeAnimatedNodesManager.getNodeById(inputNode);
    if (animatedNode != null && animatedNode instanceof ValueAnimatedNode) {
      mValue = ((ValueAnimatedNode) animatedNode).mValue % modulus;
    } else {
      throw new JSApplicationCausedNativeException("Illegal node ID set as an input for " +
        "Animated.modulus node");
    }
  }
}
