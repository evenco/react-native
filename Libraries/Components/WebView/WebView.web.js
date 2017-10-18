/**
 * @providesModule WebView
 */
'use strict';

var React = require('React');
var PropTypes = require('prop-types');
var StyleSheet = require('StyleSheet');
var webifyStyle = require('webifyStyle');
var keyMirror = require('keymirror');

var WebViewState = keyMirror({
    IDLE: null,
    LOADING: null,
    ERROR: null,
});

var styles = StyleSheet.create({

    container: {
        flex: 1,
    },

    iframe: {
        flex: 1,
    },

    hidden: {
        height: 0,
        flex: 0,
    },

});

class WebView extends React.Component {

    static propTypes = {
        url: PropTypes.string,
        renderError: PropTypes.func,
        renderLoading: PropTypes.func,
        startInLoadingState: PropTypes.bool,
    };

    constructor(props) {
        super(props);

        this.state = {
            viewState: WebViewState.IDLE,
        };
    }

    componentWillMount() {
        if (this.props.startInLoadingState) {
            this.setState({viewState: WebViewState.LOADING});
        }
    }

    render() {
        var isLoading = this.state.viewState == WebViewState.LOADING;
        var isErrored = this.state.viewState == WebViewState.ERROR;
        var containerStyle = webifyStyle([styles.container, this.props.style]);
        var iframeStyle = webifyStyle([styles.iframe, (isLoading || isErrored) && styles.hidden]);
        return (
            <div style={containerStyle}>
                {isLoading && this._renderLoadingView()}
                {isErrored && this._renderErrorView()}
                <iframe
                    style={iframeStyle}
                    src={this.props.url}
                    onLoad={this._onLoad}
                    onError={this._onError}>
                </iframe>
            </div>
        );
    }

    _renderLoadingView() {
        if (this.props.renderLoading) {
            return this.props.renderLoading();
        }
        return null;
    }

    _renderErrorView() {
        if (this.props.renderError) {
            return this.props.renderError();
        }
        return null;
    }

    _onLoad = () => {
        this.setState({viewState: WebViewState.IDLE});
    };

    _onError = () => {
        this.setState({viewState: WebViewState.ERROR});
    };

}

module.exports = WebView;
