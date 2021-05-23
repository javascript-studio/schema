'use strict';

exports.path = path;
exports.arrayPath = arrayPath;

function path(parent, key) {
  return parent ? `${parent}.${key}` : key;
}

function arrayPath(parent, index) {
  return `${parent || ''}[${index}]`;
}
