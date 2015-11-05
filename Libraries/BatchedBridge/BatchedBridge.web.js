/**
 * @providesModule BatchedBridge
 */
'use strict';

var React = require('React');

var BatchedBridge = {

  RemoteModules: {

    UIManager: {

      layoutAnimationDisabled: true,
      customBubblingEventTypes: {},
      customDirectEventTypes: {},
      Dimensions: {},

      RCTScrollView: {
        Constants: {},
      },

      measure: function(nodeID, onSuccess) {
        var rect = document.querySelector(`[data-reactid="${nodeID}"]`).getBoundingClientRect();
        onSuccess(rect.left, rect.top, rect.width, rect.height, rect.left, rect.top);
      },

      measureLayout: function(nodeHandle, relativeToNativeNode, onFail, onSuccess) {
        var nodeMeasure = React.findDOMNode(nodeHandle).getBoundingClientRect();
        var ancestorMeasure = React.findDOMNode(relativeToNativeNode).getBoundingClientRect();
        onSuccess(
          nodeMeasure.left - ancestorMeasure.left,
          nodeMeasure.top - ancestorMeasure.top,
          nodeMeasure.width,
          nodeMeasure.height,
        );
      },

      measureLayoutRelativeToParent: function(nodeHandle, onFail, onSuccess) {
        var node = React.findDOMNode(nodeHandle);
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

    ActionSheetManager: {

      showShareActionSheetWithOptions: function(options, failureCallback, successCallback) {
        console.error('Not supported on this platform');
      },

      showActionSheetWithOptions: function(options, failureCallback, successCallback) {
        console.error('Not supported on this platform');
      },

    },

  },

};

module.exports = BatchedBridge;
