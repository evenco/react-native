/**
 * Copyright (c) 2016-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 * @providesModule ReactNative
 */
 'use strict';

const ReactDOM = require('react-dom');
const findNodeHandle = require('findNodeHandle');

var ReactNative = {
  hasReactNativeInitialized: false,
  findNodeHandle: findNodeHandle,
  render: ReactDOM.render,
  unmountComponentAtNode: ReactDOM.unmountComponentAtNode,
  unstable_batchedUpdates: ReactDOM.unstable_batchedUpdates,
  unmountComponentAtNodeAndRemoveContainer: ReactDOM.unmountComponentAtNode,
};

module.exports = ReactNative;
