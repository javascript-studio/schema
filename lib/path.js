'use strict';

exports.path = path;

function path(parent, key) {
  return parent ? `${parent}.${key}` : key;
}
