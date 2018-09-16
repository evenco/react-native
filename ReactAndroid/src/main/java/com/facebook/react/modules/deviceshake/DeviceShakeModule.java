/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

package com.facebook.react.modules.deviceshake;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.common.ShakeDetector;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter;

import android.content.Context;
import android.hardware.SensorManager;

import java.util.HashMap;
import java.util.Map;

@ReactModule(name = DeviceShakeModule.NAME)
public class DeviceShakeModule extends ReactContextBaseJavaModule {

  protected static final String NAME = "DeviceShakeManager";
  protected static final String SHAKE_EVENT_NAME = "DeviceShake";
  private final ShakeDetector mShakeDetector;

  public DeviceShakeModule(ReactApplicationContext reactContext) {
    super(reactContext);

    mShakeDetector = new ShakeDetector(new ShakeDetector.ShakeListener() {
      @Override
      public void onShake() {
        sendDeviceShakeChangeEvent();
      }
    }, 1);

    Context context = reactContext.getApplicationContext();
    mShakeDetector.start((SensorManager) context.getSystemService(Context.SENSOR_SERVICE));
  }

  @Override
  public String getName() {
    return NAME;
  }

  @Override
  public Map<String, Object> getConstants() {
    Map<String, Object> constants = new HashMap<>();
    constants.put("shakeEventName", SHAKE_EVENT_NAME);
    return constants;
  }

  private void sendDeviceShakeChangeEvent() {
    getReactApplicationContext().getJSModule(RCTDeviceEventEmitter.class)
            .emit(SHAKE_EVENT_NAME, null);
  }
}
