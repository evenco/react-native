/**
 * @providesModule View
 * @flow
 */
'use strict';

var React = require('React');
var StyleSheet = require('StyleSheet');
var StyleSheetPropType = require('StyleSheetPropType');
var ViewStylePropTypes = require('ViewStylePropTypes');
var webifyStyle = require('webifyStyle');

var stylePropType = StyleSheetPropType(ViewStylePropTypes);

var pixelKeys = {
    top: true,
    left: true,
    right: true,
    bottom: true,
};

var View = React.createClass({

    propTypes: {
        style: stylePropType,
        stopPropagation: React.PropTypes.bool,
    },

    cachedMeasurement: {
        width: 0,
        height: 0,
    },

    componentDidMount: function() {
        // Listen for window resize as an indicator
        // that our measurements may have changed
        window.addEventListener('resize', this._onWindowResize);
    },

    componentWillUnmount: function() {
        window.removeEventListener('resize', this._onWindowResize);
    },

    setNativeProps: function(props: Object) {
        if (!this._div) {
            return;
        }
        if (props.opacity) {
            this._div.style.opacity = props.opacity;
        }
        if (props.style) {
            var style = webifyStyle(props.style);
            for (var key in style) {
                var value = style[key];
                if (pixelKeys[key]) {
                    value = value + 'px';
                }
                this._div.style[key] = value;
            }
        }
    },

    measure: function(callback?: Function): Object {
        var m = this._div.getBoundingClientRect();
        if (callback) {
            callback(m.left, m.top, m.width, m.height, m.left, m.top);
        }
        return m;
    },

    childrenWithPointerEvents: function(children, value) {
        if (!children) {
            return children;
        }
        if (Array.isArray(children)) {
            return children.map((child) => {
                return this.childrenWithPointerEvents(child, value);
            });
        }
        return React.cloneElement(children, {
            pointerEvents: value,
        });
    },

    render: function(): ReactElement {
        var {
            accessible,
            accessibilityLabel,
            accessibilityComponentType,
            accessibilityTraits,
            collapsable,
            onPress,
            onLayout,
            hitSlop,
            onStartShouldSetResponder,
            onResponderTerminationRequest,
            onResponderGrant,
            onResponderMove,
            onResponderRelease,
            onResponderTerminate,
            pointerEvents,
            style,
            testID,
            children,
            ...props,
        } = this.props;

        // pointer events

        var childPointerEvents;
        if (pointerEvents) {
            switch (pointerEvents) {
                case 'auto':
                    pointerEvents = 'auto';
                    break;
                case 'none':
                    pointerEvents = 'none';
                    break;
                case 'box-only':
                    childPointerEvents = 'none';
                    break;
                case 'box-none':
                    pointerEvents = 'none';
                    childPointerEvents = 'auto';
                    break;
            }
        }

        style = webifyStyle([style, {
            pointerEvents: pointerEvents,
        }]);

        if (childPointerEvents) {
            children = this.childrenWithPointerEvents(children, childPointerEvents);
        }

        // layout

        // I don't like this at all but
        // componentDidUpdate is not being fired reliably
        // Not sure what's going on...
        setTimeout(this._onLayout, 50);

        return (
            <div
                {...props}
                ref={(ref) => this._div = ref}
                style={style}
                children={children}
            />
        );
    },

    _onWindowResize: function() {
        this._onLayout();
    },

    _onLayout: function() {
        if (!this.props.onLayout || !this._div) {
            return;
        }
        var measure = this.measure();
        if (measure.width != this.cachedMeasurement.width ||
            measure.height != this.cachedMeasurement.height) {
            this.cachedMeasurement = measure;
            this.props.onLayout({
                nativeEvent: {
                    layout: {
                        width: measure.width,
                        height: measure.height,
                    },
                },
            });
        }
    },

});

module.exports = View;
