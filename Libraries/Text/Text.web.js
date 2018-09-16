/**
 * @providesModule Text
 */
'use strict';

var React = require('React');
var { StyleSheet } = require('react-native');
var StyleSheetPropType = require('StyleSheetPropType');
var TextStylePropTypes = require('TextStylePropTypes');
var webifyStyle = require('webifyStyle');

var stylePropType = StyleSheetPropType(TextStylePropTypes);

var styles = StyleSheet.create({

    containerSpan: {
        wordBreak: 'break-word',
    },

});

class Text extends React.Component {

    static propTypes = {
        style: stylePropType,
    };

    setNativeProps(props) {
        // TODO
    }

    render() {
        var {
            style,
            children,
            allowFontScaling,
            numberOfLines,
            collapsable,
            onClick,
            onPress,
            onLongPress,
            ...props,
        } = this.props;

        onClick = onClick || onPress;

        if (typeof children == 'string') {
            if (children.indexOf('\n') >= 0) {
                var textParts = children.split('\n');
                var textPartsIncludingNewlines = [];
                for (var i in textParts) {
                    if (i > 0) {
                        textPartsIncludingNewlines.push('\n');
                    }
                    textPartsIncludingNewlines.push(textParts[i]);
                }
                children = textPartsIncludingNewlines.map(this._renderInnerText);
            } else {
                children = [this._renderChild(children)];
            }
        } else if (children instanceof Array) {
            children = children.map(this._renderChild);
        } else if (children) {
            children = [this._renderChild(children)];
        }
        var finalStyle = {
            ...webifyStyle([style, styles.containerSpan]),
        };
        if (numberOfLines == 1) {
            finalStyle.overflow = 'hidden';
        }
        if (onClick) {
            finalStyle.cursor = 'pointer';
        }
        const finalProps = {
            ...props,
            style: finalStyle,
            children: React.Children.toArray(children),
            onClick: onClick,
        };
        return <span {...finalProps} />;
    }

    _renderInnerText = (text) => {
        let style = {};
        if (this.props.numberOfLines == 1) {
            style['whiteSpace'] = 'nowrap'
        }
        if (text === "\n") {
            return <br/>;
        }
        return <span style={style}>{text}</span>
    };

    _renderChild = (child) => {
        if (React.isValidElement(child)) {
            return child;
        }
        if (child instanceof Array) {
            return child.map(this._renderChild);
        }
        return this._renderInnerText(child);
    };

}

module.exports = Text;
