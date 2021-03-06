/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */
'use strict';

import type {
  DangerouslyImpreciseStyle,
  DangerouslyImpreciseStyleProp,
} from 'StyleSheet';

function flattenStyle(
  style: ?DangerouslyImpreciseStyleProp,
): ?DangerouslyImpreciseStyle {
  if (style === null || typeof style !== 'object') {
    return undefined;
  }

  if (!Array.isArray(style)) {
    return style;
  }

  const result = {};
  for (let i = 0, styleLength = style.length; i < styleLength; ++i) {
    const computedStyle = flattenStyle(style[i]);
    if (computedStyle) {
      for (const key in computedStyle) {
        // <Even>
        if (key == 'transform' && result[key]) {
          result[key] = result[key].concat(computedStyle[key]);
        // </Even>
        } else {
          result[key] = computedStyle[key];
        }
      }
    }
  }
  return result;
}

module.exports = flattenStyle;
