/**
 * @providesModule BatchedBridge
 */
'use strict';

var React = require('React');
var ReactDOM = require('react/lib/ReactDOM');

//

var remoteModules = {

  UIManager: {

    layoutAnimationDisabled: true,
    // customBubblingEventTypes: {},
    // customDirectEventTypes: {},
    Dimensions: {},

    RCTScrollView: {
      Constants: {},
    },

    measure: function(nodeID, onSuccess) {
      var rect = document.querySelector(`[data-reactid="${nodeID}"]`).getBoundingClientRect();
      onSuccess(rect.left, rect.top, rect.width, rect.height, rect.left, rect.top);
    },

    measureLayout: function(nodeHandle, relativeToNativeNode, onFail, onSuccess) {
      var nodeMeasure = ReactDOM.findDOMNode(nodeHandle).getBoundingClientRect();
      var ancestorMeasure = ReactDOM.findDOMNode(relativeToNativeNode).getBoundingClientRect();
      onSuccess(
        nodeMeasure.left - ancestorMeasure.left,
        nodeMeasure.top - ancestorMeasure.top,
        nodeMeasure.width,
        nodeMeasure.height,
      );
    },

    measureLayoutRelativeToParent: function(nodeHandle, onFail, onSuccess) {
      var node = ReactDOM.findDOMNode(nodeHandle);
      var nodeMeasure = node.getBoundingClientRect();

      var ancestorMeasure = {left: 0, top: 0};
      if (!!node.parentElement) {
        ancestorMeasure = node.parentElement.getBoundingClientRect();
      }

      onSuccess(
        nodeMeasure.left - ancestorMeasure.left,
        nodeMeasure.top - ancestorMeasure.top,
        nodeMeasure.width,
        nodeMeasure.height,
      );
    },

    configureNextLayoutAnimation: function(config, onAnimationDidEnd, onError) {
      if (onAnimationDidEnd) {
        onAnimationDidEnd();
      }
    },

    setChildren: () => {
      console.log('setChildren');
    },

  },

  AppState: {

    getCurrentAppState: function(callback) {
      return callback('active');
    },

  },

  PushNotificationManager: {

    scheduleLocalNotification: function(details) {},
    setApplicationIconBadgeNumber: function(number) {},
    getApplicationIconBadgeNumber: function(callback) {},
    requestPermissions: function(permissions) {},
    abandonPermissions: function() {},

    checkPermissions: function(callback) {
      window.setTimeout(function() {
        callback({});
      }, 0);
    },

  },

  StatusBarManager: {
    HEIGHT: 0,
  },

  ActionSheetManager: {

    showShareActionSheetWithOptions: function(options, failureCallback, successCallback) {
      console.error('Not supported on this platform');
    },

    showActionSheetWithOptions: function(options, failureCallback, successCallback) {
      console.error('Not supported on this platform');
    },

  },

  NetInfo: {

    getCurrentConnectivity: function() {
      return Promise.resolve({
        network_info: {},
      });
    },
  },

  WebSocketModule: {

    connect: () => {},
    send: () => {},
    sendBinary: () => {},
    close: () => {},
    ping: () => {},

  },

};

var remoteModulesConfig = [];
for (var moduleName in remoteModules) {
  var methods = [];
  for (var fieldName in remoteModules[moduleName]) {
    methods.push(fieldName);
  }
  remoteModulesConfig.push([
    moduleName, // name
    null,       // constants
    methods,    // methods
    [],         // promise methods
    [],         // sync methods
  ]);
}

//

class BatchedBridge {

  createDebugLookup(moduleID: number, name: string, methods: Array<string>) {
    //
  }

  registerCallableModule(name: string, module: Object) {
    //
  }

  enqueueNativeCall(moduleID: number, methodID: number, params: Array<any>, onFail: ?Function, onSucc: ?Function) {
    onFail && params.push(onFail);
    onSucc && params.push(onSucc);
    var moduleConfig = remoteModulesConfig[moduleID];
    var methodName = moduleConfig[2][methodID];
    var module = remoteModules[moduleConfig[0]];
    module[methodName](...params);
  }

}

var batchedBridge = new BatchedBridge();

global.__fbBatchedBridgeConfig = {
  remoteModuleConfig: remoteModulesConfig,
};

global.__fbBatchedBridge = {
  configurable: true,
  value: batchedBridge,
};

module.exports = batchedBridge;
