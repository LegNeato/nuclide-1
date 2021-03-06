'use babel';
/* @flow */

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import type {Collection} from '../types/ast';
import type {SourceOptions} from '../options/SourceOptions';
import type {TransformKey} from '../types/transforms';

var addLeadingComments = require('./addLeadingComments');
var addMissingRequires = require('./addMissingRequires');
var addMissingTypes = require('./addMissingTypes');
var formatRequires = require('./formatRequires');
var removeLeadingComments = require('./removeLeadingComments');
var removeUnusedRequires = require('./removeUnusedRequires');
var removeUnusedTypes = require('./removeUnusedTypes');

/**
 * This is the collection of transforms that affect requires.
 */
function transform(root: Collection, options: SourceOptions): void {
  var blacklist: Set<TransformKey> = options.blacklist || new Set();
  if (!blacklist.has('requires.transferComments')) {
    var comments = removeLeadingComments(root);
  }
  if (!blacklist.has('requires.removeUnusedRequires')) {
    removeUnusedRequires(root, options);
  }
  if (!blacklist.has('requires.addMissingRequires')) {
    addMissingRequires(root, options);
  }
  if (!blacklist.has('requires.removeUnusedTypes')) {
    removeUnusedTypes(root, options);
  }
  if (!blacklist.has('requires.addMissingTypes')) {
    addMissingTypes(root, options);
  }
  if (!blacklist.has('requires.formatRequires')) {
    formatRequires(root);
  }
  if (!blacklist.has('requires.transferComments')) {
    addLeadingComments(root, comments);
  }
}

module.exports = transform;
