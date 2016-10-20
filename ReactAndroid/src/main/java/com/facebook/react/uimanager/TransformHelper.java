package com.facebook.react.uimanager;

import com.facebook.react.bridge.JSApplicationIllegalArgumentException;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
<<<<<<< HEAD
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.ReadableType;

// <Even> Like woah

/**
 */
public class TransformHelper {

  private static final ThreadLocal<double[]> HELPER_MATRIX = new ThreadLocal<double[]>() {
    @Override protected double[] initialValue() {
=======
import com.facebook.react.bridge.ReadableType;

/**
 * Class providing helper methods for converting transformation list (as accepted by 'transform'
 * view property) into a transformation matrix.
 */
public class TransformHelper {

  private static ThreadLocal<double[]> sHelperMatrix = new ThreadLocal<double[]>() {
    @Override
    protected double[] initialValue() {
>>>>>>> upstream/0.36-stable
      return new double[16];
    }
  };

  private static double convertToRadians(ReadableMap transformMap, String key) {
    double value;
<<<<<<< HEAD
    boolean inRadians = false;
    if (transformMap.getType(key) == ReadableType.String) {
      String stringValue = transformMap.getString(key);
      if (stringValue.endsWith("rad")) {
        inRadians = true;
        stringValue = stringValue.substring(0, stringValue.length() - 3);
      } else if (stringValue.endsWith("deg")) {
=======
    boolean inRadians = true;
    if (transformMap.getType(key) == ReadableType.String) {
      String stringValue = transformMap.getString(key);
      if (stringValue.endsWith("rad")) {
        stringValue = stringValue.substring(0, stringValue.length() - 3);
      } else if (stringValue.endsWith("deg")) {
        inRadians = false;
>>>>>>> upstream/0.36-stable
        stringValue = stringValue.substring(0, stringValue.length() - 3);
      }
      value = Float.parseFloat(stringValue);
    } else {
      value = transformMap.getDouble(key);
    }
    return inRadians ? value : MatrixMathHelper.degreesToRadians(value);
  }

  public static void processTransform(ReadableArray transforms, double[] result) {
<<<<<<< HEAD
    double[] helperMatrix = HELPER_MATRIX.get();
    MatrixMathHelper.resetIdentityMatrix(result);

    for (int transformIdx = 0, size = transforms.size(); transformIdx < size; transformIdx++) {
      // <Even>
      if (transforms.isNull(transformIdx) ||
          transforms.getType(transformIdx) != ReadableType.Map) {
        continue;
      }
      // </Even>

      ReadableMap transform = transforms.getMap(transformIdx);

      // <Even>
      ReadableMapKeySetIterator iterator = transform.keySetIterator();
      if (!iterator.hasNextKey()) {
        continue;
      }
      // </Even>
      String transformType = iterator.nextKey();
=======
    double[] helperMatrix = sHelperMatrix.get();
    MatrixMathHelper.resetIdentityMatrix(result);

    for (int transformIdx = 0, size = transforms.size(); transformIdx < size; transformIdx++) {
      ReadableMap transform = transforms.getMap(transformIdx);
      String transformType = transform.keySetIterator().nextKey();
>>>>>>> upstream/0.36-stable

      MatrixMathHelper.resetIdentityMatrix(helperMatrix);
      if ("matrix".equals(transformType)) {
        ReadableArray matrix = transform.getArray(transformType);
        for (int i = 0; i < 16; i++) {
          helperMatrix[i] = matrix.getDouble(i);
        }
      } else if ("perspective".equals(transformType)) {
        MatrixMathHelper.applyPerspective(helperMatrix, transform.getDouble(transformType));
      } else if ("rotateX".equals(transformType)) {
        MatrixMathHelper.applyRotateX(
          helperMatrix,
          convertToRadians(transform, transformType));
      } else if ("rotateY".equals(transformType)) {
        MatrixMathHelper.applyRotateY(
          helperMatrix,
          convertToRadians(transform, transformType));
      } else if ("rotate".equals(transformType) || "rotateZ".equals(transformType)) {
        MatrixMathHelper.applyRotateZ(
          helperMatrix,
          convertToRadians(transform, transformType));
      } else if ("scale".equals(transformType)) {
<<<<<<< HEAD
        MatrixMathHelper.applyScaleZ(helperMatrix, transform.getDouble(transformType));
=======
        double scale = transform.getDouble(transformType);
        MatrixMathHelper.applyScaleX(helperMatrix, scale);
        MatrixMathHelper.applyScaleY(helperMatrix, scale);
>>>>>>> upstream/0.36-stable
      } else if ("scaleX".equals(transformType)) {
        MatrixMathHelper.applyScaleX(helperMatrix, transform.getDouble(transformType));
      } else if ("scaleY".equals(transformType)) {
        MatrixMathHelper.applyScaleY(helperMatrix, transform.getDouble(transformType));
      } else if ("translate".equals(transformType)) {
        ReadableArray value = transform.getArray(transformType);
        double x = value.getDouble(0);
        double y = value.getDouble(1);
        double z = value.size() > 2 ? value.getDouble(2) : 0d;
        MatrixMathHelper.applyTranslate3D(helperMatrix, x, y, z);
      } else if ("translateX".equals(transformType)) {
        MatrixMathHelper.applyTranslate2D(helperMatrix, transform.getDouble(transformType), 0d);
      } else if ("translateY".equals(transformType)) {
        MatrixMathHelper.applyTranslate2D(helperMatrix, 0d, transform.getDouble(transformType));
      } else if ("skewX".equals(transformType)) {
        MatrixMathHelper.applySkewX(
          helperMatrix,
          convertToRadians(transform, transformType));
      } else if ("skewY".equals(transformType)) {
        MatrixMathHelper.applySkewY(
          helperMatrix,
          convertToRadians(transform, transformType));
      } else {
        throw new JSApplicationIllegalArgumentException("Unsupported transform type: "
          + transformType);
      }

      MatrixMathHelper.multiplyInto(result, result, helperMatrix);
    }
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> upstream/0.36-stable
