'use strict';

exports.objectPath = objectPath;
exports.arrayPath = arrayPath;

function objectPath(parent, key) {
  return parent ? `${parent}.${key}` : key;
}

function arrayPath(parent, index) {
  return `${parent || ''}[${index}]`;
}
