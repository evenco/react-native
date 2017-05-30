/**
 * @providesModule BatchedBridge
 */
'use strict';

var React = require('React');
var ReactDOM = require('react-dom');

var async = (method) => {
  return {
    type: 'async',
    method: method,
  };
};

var sync = (method) => {
  return {
    type: 'sync',
    method: method,
  };
};

var promise = (method) => {
  return {
    type: 'promise',
    method: method,
  };
};

var remoteModules = {

  UIManager: {

    constants: {
      layoutAnimationDisabled: true,
      Dimensions: {},
    },

    measure: async((nodeID, onSuccess) => {
      var rect = ReactDOM.findDOMNode(nodeID).getBoundingClientRect();
      onSuccess(rect.left, rect.top, rect.width, rect.height, rect.left, rect.top);
    }),

    measureLayout: async((nodeHandle, relativeToNativeNode, onFail, onSuccess) => {
      var nodeMeasure = ReactDOM.findDOMNode(nodeHandle).getBoundingClientRect();
      var ancestorMeasure = ReactDOM.findDOMNode(relativeToNativeNode).getBoundingClientRect();
      onSuccess(
        nodeMeasure.left - ancestorMeasure.left,
        nodeMeasure.top - ancestorMeasure.top,
        nodeMeasure.width,
        nodeMeasure.height,
      );
    }),

    measureLayoutRelativeToParent: async((nodeHandle, onFail, onSuccess) => {
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
    }),

    configureNextLayoutAnimation: async((config, onAnimationDidEnd, onError) => {
      if (onAnimationDidEnd) {
        onAnimationDidEnd();
      }
    }),

  },

  AppState: {

    getCurrentAppState: async((callback) => {
      return callback('active');
    }),

  },

  PushNotificationManager: {

    scheduleLocalNotification: async((details) => {
      // noop
    }),

    setApplicationIconBadgeNumber: async((number) => {
      // noop
    }),

    getApplicationIconBadgeNumber: async((callback) => {
      callback(0);
    }),

    requestPermissions: promise((resolve) => {
      resolve({});
    }),

    abandonPermissions: async(() => {
      // noop
    }),

    checkPermissions: async((callback) => {
      callback({});
    }),

  },

  StatusBarManager: {

    constants: {
      HEIGHT: 0,
    },

  },

  ActionSheetManager: {

    showShareActionSheetWithOptions: async((options, failureCallback, successCallback) => {
      console.error('Not supported on this platform');
    }),

    showActionSheetWithOptions: async((options, failureCallback, successCallback) => {
      console.error('Not supported on this platform');
    }),

  },

  NetInfo: {

    getCurrentConnectivity: promise((resolve) => {
      resolve({
        network_info: {},
      });
    }),

  },

  WebSocketModule: {

    connect: async(() => {
      // noop
    }),

    send: async(() => {
      // noop
    }),

    sendBinary: async(() => {
      // noop
    }),

    close: async(() => {
      // noop
    }),

    ping: async(() => {
      // noop
    }),

  },

};

var remoteModulesConfig = [];

for (var moduleName in remoteModules) {
  var remoteModule = remoteModules[moduleName];

  var constants = null;
  var methods = [];
  var promiseMethodIDs = [];
  var syncMethodIDs = [];

  var i = 0;
  for (var fieldName in remoteModule) {
    var fieldDefinition = remoteModule[fieldName];

    if (fieldName == 'constants') {
      constants = fieldDefinition;
      continue;
    }

    methods.push(fieldName);
    switch (fieldDefinition.type) {
      case 'promise':
        promiseMethodIDs.push(i);
        break;
      case 'sync':
        syncMethodIDs.push(i);
        break;
      default:
        break;
    }

    i++;
  }

  remoteModulesConfig.push([
    moduleName,       // name
    constants,        // constants
    methods,          // methods
    promiseMethodIDs, // promise methods
    syncMethodIDs,    // sync methods
  ]);
}

class BatchedBridge {

  createDebugLookup(moduleID: number, name: string, methods: Array<string>) {
    // noop
  }

  registerCallableModule(name: string, module: Object) {
    // noop
  }

  enqueueNativeCall(moduleID: number, methodID: number, params: Array<any>, onFail: ?Function, onSucc: ?Function) {
    onFail && params.push(onFail);
    onSucc && params.push(onSucc);
    var moduleConfig = remoteModulesConfig[moduleID];
    var methodName = moduleConfig[2][methodID];
    var module = remoteModules[moduleConfig[0]];
    module[methodName].method(...params);
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
