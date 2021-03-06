'use babel';
/* @flow */

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import {assign} from './object';

function immutableExtend(...args: Array<Object>) {
  return assign({}, ...args);
}

module.exports = {
  immutableExtend,
};
