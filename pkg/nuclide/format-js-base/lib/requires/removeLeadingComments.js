'use babel';
/* @flow */

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import type {Collection, Node} from '../types/ast';

var FirstNode = require('../utils/FirstNode');

/**
 * Removes the leading comments from the first node. Leading comments are
 * defined as:
 *
 *   - let N be the number of leading comments numbered 0 to N-1
 *   - if there is space betwee comment N-1 and first, comments 0 to N-1
 *   - else comments 0 to N-2
 */
function removeLeadingComments(root: Collection): Array<Node> {
  var firstPath = FirstNode.get(root);
  if (!firstPath) {
    return [];
  }
  var first = firstPath.node;
  if (!first || !first.comments) {
    return [];
  }

  // Check if the last comment ends exactly where the first node starts.
  var transferLastcomment = false;
  var lastComment = first.comments.reduce(
    (curr, next) => next.leading ? next : curr,
    null
  );
  if (lastComment && first.start != null && lastComment.end != null) {
    var difference = Math.abs(first.start - lastComment.end);
    if (difference > 1) {
      transferLastcomment = true;
    }
  }

  // Count how many comments we need to transfer, treat negative counts as 0.
  var transferCount = first.comments.reduce(
    (count, next) => next.leading ? count + 1 : count,
    transferLastcomment ? 0 : -1,
  );
  if (transferCount <= 0) {
    return [];
  }

  // Make the transfer.
  var transfer = [];
  var keep = [];
  first.comments.forEach(comment => {
    if (transfer.length < transferCount && comment.leading) {
      transfer.push(comment);
    } else {
      keep.push(comment);
    }
  });

  first.comments = keep;
  firstPath.replace(first);
  return transfer;
}

module.exports = removeLeadingComments;
