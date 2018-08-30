/**
 * @providesModule View
 * @flow
 */
'use strict';

var React = require('React');
var PropTypes = require('prop-types');
var ReactNative = require('react-native');
var ReactDOM = require('react-dom');
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

class View extends React.Component {

    static propTypes = {
        style: stylePropType,
    };

    _cachedMeasurement = {
        width: 0,
        height: 0,
    };

    componentDidMount() {
        // Listen for window resize as an indicator
        // that our measurements may have changed
        window.addEventListener('resize', this._onWindowResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._onWindowResize);
    }

    setNativeProps(props) {
        if (!this._div) {
            return;
        }
        if (props.opacity) {
            this._div.style.opacity = props.opacity;
        }
        if (props.pointerEvents) {
            this._div.className = this._classNameForPointerEvents(props.pointerEvents);
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
    }

    measure(callback) {
        var rect = ReactDOM.findDOMNode(this).getBoundingClientRect();
        if (callback) {
            callback(rect.left, rect.top, rect.width, rect.height, rect.left, rect.top);
        }
        return rect;
    }

    render() {
        var {
            accessible,
            accessibilityLabel,
            accessibilityComponentType,
            accessibilityTraits,
            accessibilityHint,
            accessibilityRole,
            accessibilityStates,
            collapsable,
            onPress,
            onLayout,
            hitSlop,
            onStartShouldSetResponder,
            onStartShouldSetResponderCapture,
            onMoveShouldSetResponder,
            onMoveShouldSetResponderCapture,
            onResponderTerminationRequest,
            onResponderStart,
            onResponderGrant,
            onResponderMove,
            onResponderRelease,
            onResponderEnd,
            onResponderTerminate,
            onResponderReject,
            pointerEvents,
            isTVSelectable,
            tvParallaxProperties,
            hasTVPreferredFocus,
            renderToHardwareTextureAndroid,
            style,
            testID,
            nativeID,
            children,
            ...props
        } = this.props;

        // pointer events

        var className;
        if (pointerEvents) {
            className = this._classNameForPointerEvents(pointerEvents);
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
                className={className}
                style={webifyStyle(style)}
                children={children}
            />
        );
    }

    _classNameForPointerEvents(pointerEvents) {
        return `rn-pointer-events-${pointerEvents}`;
    }

    _onWindowResize = () => {
        this._onLayout();
    };

    _onLayout = () => {
        if (!this.props.onLayout || !this._div) {
            return;
        }
        var measure = this.measure();
        if (measure.width != this._cachedMeasurement.width ||
            measure.height != this._cachedMeasurement.height) {
            this._cachedMeasurement = measure;
            this.props.onLayout({
                nativeEvent: {
                    layout: {
                        width: measure.width,
                        height: measure.height,
                    },
                },
            });
        }
    };

}

// <Even>
// DUPED!

const AccessibilityTraits = [
  'none',
  'button',
  'link',
  'header',
  'search',
  'image',
  'selected',
  'plays',
  'key',
  'text',
  'summary',
  'disabled',
  'frequentUpdates',
  'startsMedia',
  'adjustable',
  'allowsDirectInteraction',
  'pageTurn',
];

const AccessibilityComponentType = [
  'none',
  'button',
  'radiobutton_checked',
  'radiobutton_unchecked',
];

View.AccessibilityTraits = AccessibilityTraits;
View.AccessibilityComponentType = AccessibilityComponentType;
View.forceTouchAvailable = false;

// </Even>

module.exports = View;
