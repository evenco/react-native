/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule AccessibilityInfo
 * @flow
 */
'use strict';

var AccessibilityInfo = {

  fetch: function(): Promise {
    resolve(null);
  },

  addEventListener: function (
    eventName: ChangeEventName,
    handler: Function
  ): void {
    // noop
  },

  removeEventListener: function(
    eventName: ChangeEventName,
    handler: Function
  ): void {
    // noop
  },

};

module.exports = AccessibilityInfo;
