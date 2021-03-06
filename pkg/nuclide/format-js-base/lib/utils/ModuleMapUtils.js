'use babel';
/* @flow */

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import type {AbsolutePath, Identifier, Literal, RelativePath} from '../types/common';

var StringUtils = require('./StringUtils');

var path = require('path');

function getIdentifiersFromPath(filePath: AbsolutePath): Set<Identifier> {
  var ids = new Set();

  var baseName = path.basename(filePath);

  // Get rid of extensions like, '.js', '.jsx', '.react.js', etc.
  var noExtensions = baseName.split('.')[0];

  // These are not valid tokens in an identifier so we have to remove them.
  var splits = noExtensions.split(/[^\w]/);

  // Just a standard identifier.
  ids.add(splits.join(''));

  // Then a camel case identifier (or possibly title case based on file name).
  var camelCaseSplits = [splits[0]];
  for (var i = 1; i < splits.length; i++) {
    camelCaseSplits.push(StringUtils.capitalize(splits[i]));
  }
  ids.add(camelCaseSplits.join(''));

  return ids;
}

function getLiteralFromPath(filePath: AbsolutePath): Literal {
  var baseName = path.basename(filePath);
  return removeFileType(baseName);
}

function relativizeForRequire(
  sourcePath: AbsolutePath,
  destPath: AbsolutePath,
): RelativePath {
  var relativePath = path.relative(path.dirname(sourcePath), destPath);
  var noFileType = removeFileType(relativePath);
  return !noFileType.startsWith('.')
    ? '.' + path.sep + noFileType
    : noFileType;
}

function removeFileType(str: string): string {
  var splits = str.split('.');
  if (splits.length <= 1) {
    return str;
  } else {
    return splits.slice(0, -1).join('.');
  }
}

var ModuleMapUtils = {
  getIdentifiersFromPath,
  getLiteralFromPath,
  relativizeForRequire,
};

module.exports = ModuleMapUtils;
