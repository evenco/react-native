/**
 * @providesModule InvertibleScrollView
 * @flow weak
 */
'use strict';

var React = require('React');
var ScrollView = require('ScrollView');
var StyleSheet = require('StyleSheet');
var View = require('View');

function cloneReferencedElement(element, config, ...children) {
  let cloneRef = config.ref;
  let originalRef = element.ref;
  if (originalRef == null || cloneRef == null) {
    return React.cloneElement(element, config, ...children);
  }

  if (typeof originalRef !== 'function') {
    if (__DEV__) {
      console.warn(
        'Cloning an element with a ref that will be overwritten because it ' +
        'is not a function. Use a composable callback-style ref instead. ' +
        'Ignoring ref: ' + originalRef,
      );
    }
    return React.cloneElement(element, config, ...children);
  }

  return React.cloneElement(element, {
    ...config,
    ref(component) {
      cloneRef(component);
      originalRef(component);
    },
  }, ...children);
}

let ScrollableMixin = {
  getInnerViewNode(): any {
    return this.getScrollResponder().getInnerViewNode();
  },

  scrollTo(destY?: number, destX?: number) {
    this.getScrollResponder().scrollTo(destY, destX);
  },

  scrollWithoutAnimationTo(destY?: number, destX?: number) {
    this.getScrollResponder().scrollWithoutAnimationTo(destY, destX);
  },
};

type DefaultProps = {
  renderScrollComponent: (props: Object) => React.Element<any>;
};

let InvertibleScrollView = React.createClass({
  mixins: [ScrollableMixin],

  _scrollComponent: (null: any),

  propTypes: {
    ...ScrollView.propTypes,
    inverted: React.PropTypes.bool,
    renderScrollComponent: React.PropTypes.func.isRequired,
  },

  getDefaultProps(): DefaultProps {
    return {
      renderScrollComponent: props => <ScrollView {...props} />,
    };
  },

  getInitialState() {
    return {
      contentHeight: 0,
    };
  },

  getScrollResponder(): React.Component<any, any, any> {
    return this._scrollComponent.getScrollResponder();
  },

  setNativeProps(props: Object) {
    this._scrollComponent.setNativeProps(props);
  },

  render() {
    var {
      inverted,
      renderScrollComponent,
      ...props,
    } = this.props;

    props.children = [this._renderBottomFill(), ...props.children];

    const needsLayout = !this._layout || this.state.contentHeight == 0;
    const style = [props.style, needsLayout && styles.hidden];

    if (inverted) {
      if (this.props.horizontal) {
        props.style = [styles.horizontallyInverted, ...style];
        props.children = this._renderInvertedChildren(props.children, styles.horizontallyInverted);
      } else {
        props.style = [styles.verticallyInverted, ...style];
        props.children = this._renderInvertedChildren(props.children, styles.verticallyInverted);
      }
    }

    return cloneReferencedElement(renderScrollComponent(props), {
      ref: component => { this._scrollComponent = component; },
      onContentSizeChange: this._onContentSizeChange,
      onLayout: this._onLayout,
    });
  },

  _renderInvertedChildren(children, inversionStyle) {
    return React.Children.map(children, child => {
      return child ? <View style={inversionStyle}>{child}</View> : child;
    });
  },

  // <Even>
  // this makes sure when content is smaller than area, it is pinned to the top
  // move this logic into InvertibleScrollView for every InvertibleScrollView to inherit this behavior

  _onLayout(e: LayoutEvent) {
    this._layout = e.nativeEvent.layout;
    if (this.props.onLayout) {
      this.props.onLayout(e);
    }
  },

  _onContentSizeChange(contentWidth, contentHeight) {
    if (this.state.contentHeight != contentHeight) {
      this.setState({contentHeight: contentHeight});
    }
    if (this.props.onContentSizeChange) {
      this.props.onContentSizeChange(contentWidth, contentHeight);
    }
  },

  _renderBottomFill() {
    var layout = this._layout;
    var contentHeight = this.state.contentHeight;
    if (!layout || !contentHeight) {
      return null;
    }

    var fillHeight = (layout.height - contentHeight + (this._bottomFillHeight || 0));
    if (fillHeight <= 0) {
      return null;
    }

    this._bottomFillHeight = fillHeight;

    return (
      <View key={'bottomFill'} style={{height: this._bottomFillHeight}} />
    );
  },

});

let styles = StyleSheet.create({
  hidden: {
    opacity: 0,
  },
  verticallyInverted: {
    transform: [
      { scaleY: -1 },
    ],
  },
  horizontallyInverted: {
    transform: [
      { scaleX: -1 },
    ],
  },
});

module.exports = InvertibleScrollView;
