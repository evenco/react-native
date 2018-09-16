/**
 * @providesModule Image
 */
'use strict';

var React = require('React');
var PropTypes = require('prop-types');
var StyleSheet = require('StyleSheet');
var webifyStyle = require('webifyStyle');
var ImageResizeMode = require('ImageResizeMode');
var ImageStylePropTypes = require('ImageStylePropTypes');
var StyleSheetPropType = require('StyleSheetPropType');
var EdgeInsetsPropType = require('EdgeInsetsPropType');

var styles = StyleSheet.create({

    container: {
        justifyContent: 'center',
    },

});

class Image extends React.Component {

    static propTypes = {
        style: StyleSheetPropType(ImageStylePropTypes),
        source: PropTypes.shape({
            uri: PropTypes.string,
        }),
        capInsets: EdgeInsetsPropType,
        resizeMode: PropTypes.oneOf(['contain', 'center', 'stretch']),
        onLayout: PropTypes.func,
    };

    static resizeMode = ImageResizeMode;

    constructor(props) {
        super(props);

        this.state = this._getStateFromProps(props);
    }

    componentWillReceiveProps(nextProps) {
        this.setState(this._getStateFromProps(nextProps));
    }

    _getStateFromProps(props) {
        var style = {};
        var source = props.source;
        if (source.capInsets) {
            var capPercents = {
                top: source.capInsets.top / source.height * 100,
                right: source.capInsets.right / source.width * 100,
                bottom: source.capInsets.bottom / source.height * 100,
                left: source.capInsets.left / source.width * 100,
            };
            Object.assign(style, {
                borderTopWidth: source.capInsets.top,
                borderRightWidth: source.capInsets.right,
                borderBottomWidth: source.capInsets.bottom,
                borderLeftWidth: source.capInsets.left,
                borderImage: `url(${source.uri}) ${capPercents.top}% ${capPercents.right}% ${capPercents.bottom}% ${capPercents.left}% stretch`,
            })
        }
        switch (props.resizeMode) {
            case 'stretch':
                style.width = '100%';
                break;
            case 'contain':
                style.display = 'inline';
                style.width = '100%';
                style.height = '100%';
                break;
            case 'center':
                style.alignSelf = 'center';
                style.maxWidth = '100%';
                style.maxHeight = '100%';
                break;
            default:
                style.width = source.width;
                style.height = source.height;
                break;
        }
        return {style: style};
    }

    render() {
        if (this.props.source.capInsets) {
            var style = webifyStyle([this.state.style, this.props.style]);
            return <div style={style} />;

        } else if (this.props.resizeMode == 'contain' || this.props.resizeMode == 'center') {
            var outerStyle = webifyStyle([this.props.style, styles.container, {textAlign: 'center'}]);
            var innerStyle = webifyStyle(this.state.style);
            return (
                <div style={outerStyle}>
                    <img style={innerStyle} src={this.props.source.uri} />
                </div>
            );

        } else {
            var style = webifyStyle([this.state.style, this.props.style]);
            return <img style={style} src={this.props.source.uri} />;
        }
    }

}

module.exports = Image;
