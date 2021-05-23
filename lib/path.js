'use strict';

exports.objectPath = objectPath;
exports.arrayPath = arrayPath;

function objectPath(base, key) {
  return base ? `${base}.${key}` : key;
}

function arrayPath(base, index) {
  return `${base || ''}[${index}]`;
}
