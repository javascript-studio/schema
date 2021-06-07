'use strict';

const { failNotSchemaObject } = require('./fail');

exports.objectPath = objectPath;
exports.arrayPath = arrayPath;
exports.raw = raw;
exports.unwrap = unwrap;

function objectPath(base, key) {
  return base ? `${base}.${key}` : key;
}

function arrayPath(base, index) {
  return `${base || ''}[${index}]`;
}

function raw(value) {
  const { toJSON } = value;
  if (!toJSON) {
    failNotSchemaObject();
  }
  return toJSON.call(value);
}

function unwrap(value) {
  const { toJSON } = value;
  return toJSON ? toJSON.call(value) : value;
}
