/**
 * @providesModule TextInput
 */
'use strict';

var React = require('React');
var PropTypes = require('prop-types');
var webifyStyle = require('webifyStyle');

import TextareaAutosize from 'TextareaAutosize';

const ENTER_KEY = '13';
const ESCAPE_KEY = '27';

class TextInput extends React.Component {

    static propTypes = {

        /**
         * Can tell TextInput to automatically capitalize certain characters.
         *
         * - characters: all characters,
         * - words: first letter of each word
         * - sentences: first letter of each sentence (default)
         * - none: don't auto capitalize anything
         */
        autoCapitalize: PropTypes.oneOf([
          'none',
          'sentences',
          'words',
          'characters',
        ]),

        /**
         * If false, disables auto-correct. Default value is true.
         */
        autoCorrect: PropTypes.bool,

        /**
         * If true, focuses the input on componentDidMount. Default value is false.
         */
        autoFocus: PropTypes.bool,

        /**
         * If false, text is not editable. Default value is true.
         */
        editable: PropTypes.bool,

        /**
         * Callback that is called when the text input is blurred
         */
        onBlur: PropTypes.func,

        /**
         * Callback that is called when the text input is focused
         */
        onFocus: PropTypes.func,

        /**
         * Callback that is called when the text input's text changes.
         */
        onChange: PropTypes.func,

        /**
         * Callback that is called when the text input's text changes.
         * Changed text is passed as an argument to the callback handler.
         */
        onChangeText: PropTypes.func,

        /**
         * If true, the text input obscures the text entered so that sensitive text
         * like passwords stay secure. Default value is false.
         */
        password: PropTypes.bool,

        /**
         * The string that will be rendered before text input has been entered
         */
        placeholder: PropTypes.string,

        /**
         * The controlled input component value
         */
        value: PropTypes.string,

        /**
         * The default value for the text input
         */
        defaultValue: PropTypes.string,

        /*
        * If true, the text input will not be editable until after it is rendered.
        * Set this for legacy Android devices that have weird focus behavior.
        */
        delayEditability: PropTypes.bool,

        /*
        * <Even>
        * If true, the text field will not be editable
        */
        manualInput: PropTypes.bool,

        /*
        * <Even>
        * If true, the text field will auto resize (web only)
        */
        autoResize: PropTypes.bool,
        maxNumberOfLines: PropTypes.number,
    };

    static defaultProps = {
        editable: true,
    };

    componentWillMount() {
        this._canFocus = !this.props.delayEditability;
    }

    componentDidMount() {
        if (this.props.delayEditability) {
            // HACK keep the input disabled long enough for all events to be processed
            // but not too long that a user's legitimate focus attempt will be discarded.
            setTimeout(() => {
                this._canFocus = true;
                this.refs.input.disabled = this._isDisabled();
            }, 100);
        }
    }

    render() {
        var {
            multiline,
            autoResize,
            maxNumberOfLines,
            clearButtonMode,
            editable,
            keyboardType,
            manualInput,
            onChangeText,
            onSubmitEditing,
            password,
            underlineColorAndroid,
            autoGrow,
            placeholderTextColor,
            enablesReturnKeyAutomatically,
            autoCorrect,
            autoComplete,
            autoCapitalize,
            value,
            style,
            ...props
        } = this.props;

        var commonProps = {
            ...props,
            ref: 'input',
            value: value || '',
            autoCorrect: onOffValue(autoCorrect),
            autoComplete: onOffValue(autoComplete),
            autoCapitalize: onOffValue(autoCapitalize),
            spellCheck: trueFalseValue(autoCorrect),
            onChange: this._onChange,
            onKeyDown: this._onKeyDown,
            disabled: !this._canFocus || this._isDisabled(),
            style: webifyStyle(style),
        };

        if (autoResize) {
            return (
                <TextareaAutosize
                    {...commonProps}
                    maxRows={maxNumberOfLines}
                />
            );
        }

        if (multiline) {
            return (
                <textarea
                    {...commonProps}
                />
            );
        }

        return (
            <input
                ref="input"
                {...commonProps}
                value={value}
                type={password ? 'password' : 'text'}
            />
        );
    }

    _isDisabled() {
        return !this.props.editable || this.props.manualInput;
    }

    _getDOMNode() {
        return this.refs.input;
    }

    _onKeyDown = (e) => {
        if (e.which == ESCAPE_KEY) {
            this.blur();
        } else if (e.which == ENTER_KEY) {
            if (this.props.onSubmitEditing) {
                e.preventDefault();
                this.props.onSubmitEditing();
            }
        }
        if (this.props.onKeyDown) {
            this.props.onKeyDown(e);
        }
    };

    _onChange = (e) => {
        if (this.props.onChange) {
            this.props.onChange(e);
        }
        if (this.props.onChangeText) {
            this.props.onChangeText(this._getDOMNode().value);
        }
    };

    focus() {
        this._getDOMNode().focus();
    }

    blur() {
        this._getDOMNode().blur();
    }

}

const onOffValue = (v) => {
    if (v === undefined) {
        return v;
    }
    return v ? 'on' : 'off';
};

const trueFalseValue = (v) => {
    if (v === undefined) {
        return v;
    }
    return v ? 'true' : 'false';
};

module.exports = TextInput;
