/**
 * @providesModule ScrollView
 * @flow
 */
'use strict';

var React = require('React');
var PropTypes = require('prop-types');
var ReactDOM = require('react-dom');
var StyleSheet = require('StyleSheet');
var View = require('View');

var styles = StyleSheet.create({

    container: {
        flex: 1,
    },

    containerHorizontal: {
        flex: null,
    },

    scroll: {
        flex: 1,
        WebkitOverflowScrolling: 'touch',
    },

    horizontal: {
        alignItems: 'flex-start',
    },

    horizontalContainer: {
        flex: 1,
        flexDirection: 'row',
    },

});

class ScrollView extends React.Component {

    static propTypes = {
        horizontal: PropTypes.bool,
        automaticallyAdjustContentInsets: PropTypes.bool,
    };

    static defaultProps = {
        automaticallyAdjustContentInsets: true,
    };

    setNativeProps(props) {
        // noop
    }

    getScrollResponder() {
        return this;
    }

    scrollTo(
        y?: number | { x?: number, y?: number, animated?: boolean },
        x?: number,
        animated?: boolean
    ) {
        if (typeof y === 'number') {
          console.warn('`scrollTo(y, x, animated)` is deprecated. Use `scrollTo({x: 5, y: 5, ' +
            'animated: true})` instead.');
        } else {
          ({x, y, animated} = y || {});
        }
        var node = ReactDOM.findDOMNode(this.refs.scrollView);
        node.scrollTop = y;
        node.scrollLeft = x;

        this._updateAnimatedValues({x, y});
    }

    scrollWithoutAnimationTo(y, x) {
        console.warn('`scrollWithoutAnimationTo` is deprecated. Use `scrollTo` instead');
        this.scrollTo({y, x});
    }

    scrollToEndOnNextContentChange() {
        this._scrollToEndOnNextContentChange = true;
    }

    scrollToEnd() {
        var scrollProps = this.scrollProperties;
        var offsetX = scrollProps.contentSize.width - scrollProps.layout.width;
        var offsetY = scrollProps.contentSize.height - scrollProps.layout.height;
        this.scrollTo({y: offsetY, x: offsetX});
    }

    componentWillMount() {
        this.scrollProperties = {
            layout: null,
            contentSize: {
                width: 0,
                height: 0,
            },
            contentOffset: {
                x: 0,
                y: 0,
            },
        };
    }

    componentDidMount() {
        this._updateScrollProperties();
        if (this.props.inverted) {
            this.scrollToEnd(); // HACK don't love
        }
    }

    componentDidUpdate(oldProps, oldState) {
        if (this.props.inverted) {
            var oldScrollProps = this.scrollProperties;
            var newScrollProps = this._updateScrollProperties();
            var contentDelta = newScrollProps.contentSize.height - oldScrollProps.contentSize.height;
            if (contentDelta > 0) {
                if (!!this._scrollToEndOnNextContentChange) {
                    this._scrollToEndOnNextContentChange = false;
                    this.scrollToEnd();
                } else {
                    this.scrollTo({y: oldScrollProps.contentOffset.y + contentDelta, x: 0});
                }
            }
        }
    }

    getInnerViewNode() {
        return this.refs.containerView;
    }

    render() {
        var scrollStyle = [
            styles.scroll,
            (this.props.horizontal ? styles.horizontal : null),
            (this.props.horizontal ? {overflowX: 'auto'} : {overflowY: 'auto'}),
        ];

        var containerStyle = [
            this.props.contentContainerStyle,
            (this.props.horizontal ? styles.horizontalContainer : null),
        ];

        const {
            style,
            children,
            onLayout,
            hitSlop,
            pointerEvents,
            hidden,
            ...props
        } = this.props;

        return (
            <View
                style={[styles.container, this.props.horizontal && styles.containerHorizontal, style]}
                onLayout={onLayout}
                hitSlop={hitSlop}
                pointerEvents={pointerEvents}
                hidden={hidden}
                >
                <View ref="scrollView" style={scrollStyle} onScroll={this._onScroll}>
                    <View ref="containerView" style={containerStyle}>
                        {children}
                    </View>
                </View>
            </View>
        );
    }

    _updateScrollProperties() {
        var layout = this.refs.scrollView.measure();
        var containerLayout = this.refs.containerView.measure();
        var scrollViewNode = ReactDOM.findDOMNode(this.refs.scrollView);
        var contentSize = {
            width: containerLayout.width,
            height: containerLayout.height,
        };
        var contentOffset = {
            x: scrollViewNode.scrollLeft,
            y: scrollViewNode.scrollTop,
        };
        this.scrollProperties = {
            layout: layout,
            contentSize: contentSize,
            contentOffset: contentOffset,
        };
        return this.scrollProperties;
    }

    _onScroll = (e) => {
        if (this.props.onScroll) {
            var scrollProperties = this._updateScrollProperties();
            e.nativeEvent.layoutMeasurement = scrollProperties.layout;
            e.nativeEvent.contentSize = scrollProperties.contentSize;
            e.nativeEvent.contentOffset = scrollProperties.contentOffset;
            this.props.onScroll(e);
        }
    };

    // HACK
    _updateAnimatedValues({x, y}) {
        this.props.animatedScrollX && this.props.animatedScrollX.setValue(x);
        this.props.animatedScrollY && this.props.animatedScrollY.setValue(y);
    }

}

module.exports = ScrollView;
