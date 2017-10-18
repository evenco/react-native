/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule BackHandler
 */

'use strict';

var BackHandler = {

  exitApp: function() {
    // noop
  },

  addEventListener: function (
    eventName: BackPressEventName,
    handler: Function
  ): {remove: () => void} {
    // noop
  },

  removeEventListener: function(
    eventName: BackPressEventName,
    handler: Function
  ): void {
    // noop
  },

};

module.exports = BackHandler;
