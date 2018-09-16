/**
 * @providesModule webifyStyle
 */
'use strict';

const merge = require('merge');
const flattenStyle = require('flattenStyle');
const processTransform = require('processTransform');
const normalizeColor = require('normalizeColor');

const styleKeyMap = {

    flex: function(value) {
        return {
            flex: value,
            WebkitFlex: value,
        };
    },

    flexDirection: function(value) {
        return {
            flexDirection: value,
            WebkitFlexDirection: value,
        };
    },

    alignItems: function(value) {
        return {
            alignItems: value,
            WebkitAlignItems: value,
        };
    },

    justifyContent: function(value) {
        return {
            justifyContent: value,
            WebkitJustifyContent: value,
        };
    },

    alignSelf: function(value) {
        return {
            alignSelf: value,
            WebkitAlignSelf: value,
        };
    },

    textDecorationLine: function(value) {
        return {
            textDecoration: value,
        };
    },

    shadowColor: function(value, allValues) {
        const color = value || 'transparent';
        let width = 0;
        let height = 0;
        const blur = allValues.shadowRadius || 0;
        if (allValues.shadowOffset) {
            width = allValues.shadowOffset.width || 0;
            height = allValues.shadowOffset.height || 0;
        }
        return {
            boxShadow: `${width}px ${height}px ${blur}px 0 ${color}`,
        };
    },

    shadowRadius: function(value) {
        return null;
    },

    shadowOpacity: function(value) {
        return null;
    },

    shadowOffset: function(value) {
        return null;
    },

    lineHeight: function(value) {
        return {
            lineHeight: `${value}px`,
        };
    },

    paddingHorizontal: function(value) {
        return {
            paddingLeft: value,
            paddingRight: value,
        };
    },

    paddingVertical: function(value) {
        return {
            paddingTop: value,
            paddingBottom: value,
        };
    },

    marginHorizontal: function(value) {
        return {
            marginLeft: value,
            marginRight: value,
        };
    },

    marginVertical: function(value) {
        return {
            marginTop: value,
            marginBottom: value,
        };
    },

    borderImage: function(value) {
        return {
            borderImage: value,
            WebkitBorderImage: value,
        };
    },

    tintColor: function(value) {
        const color = normalizeColor(value);
        if (!color) {
            return {};
        }
        // HACK (white or black?)
        const r = (color >> 24) & 0xff;
        const g = (color >> 16) & 0xff;
        const b = (color >> 8) & 0xff;
        if (r + g + b >= 250 * 3) {
            return {filter: 'saturate(0%) brightness(1000%)'};
        }
        return {filter: 'saturate(0%) brightness(0%)'};
    },

    transformMatrix: function(value) {
        const cssValue = `matrix3d(${value})`;
        return {
            transform: cssValue,
            WebkitTransform: cssValue,
        };
    },

    transform: function(value) {
        if (!value) {
            return {};
        }
        const transformMatrix = processTransform(value); // TODO how are nulls getting here
        const cssValue = `matrix3d(${transformMatrix})`;
        return {
            transform: cssValue,
            WebkitTransform: cssValue,
        };
    },

};

const webifyStyle = function(style) {
    let webifiedStyle = {};
    const flattenedStyle = flattenStyle(style);
    for (let key in flattenedStyle) {
        const value = flattenedStyle[key];
        const transformFunction = styleKeyMap[key];
        if (transformFunction) {
            webifiedStyle = merge(webifiedStyle, transformFunction(value, flattenedStyle));
        } else {
            webifiedStyle[key] = value;
        }
    }
    return webifiedStyle;
};

module.exports = webifyStyle;
