/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @polyfill
 */

/* eslint-disable strict */

global.__DEV__ = false;

global.__BUNDLE_START_TIME__ = Date.now();

// <Even> (web)
if (!global.process) {
    global.process = {
        env: {},
        nextTick: function(fn) {
            setTimeout(fn, 0);
        },
    };
}
// </Even>
