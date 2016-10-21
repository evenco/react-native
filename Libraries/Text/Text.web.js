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

var Text = React.createClass({

    propTypes: {
        style: stylePropType,
    },

    setNativeProps: function(props) {
        // TODO
    },

    render: function() {
        var {
            style,
            children,
            allowFontScaling,
            ...props,
        } = this.props;

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

        return (
            <span
                {...props}
                style={webifyStyle([style, styles.containerSpan])}
                children={React.Children.toArray(children)}
                />
        );
    },

    _renderInnerText: function(text) {
        if (text === "\n") {
            return <br/>;
        }
        return <span>{text}</span>
    },

    _renderChild: function(child) {
        if (React.isValidElement(child)) {
            return child;
        }
        if (child instanceof Array) {
            return child.map(this._renderChild);
        }
        return this._renderInnerText(child);
    },

});

module.exports = Text;
