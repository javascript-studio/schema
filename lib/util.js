'use strict';

const { typeOf } = require('./type-of');
const { failNotSchemaObject, failType } = require('./fail');

exports.objectPath = objectPath;
exports.arrayPath = arrayPath;
exports.raw = raw;
exports.unwrap = unwrap;
exports.assertType = assertType;

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

function assertType(value, type, base) {
  if (typeOf(value) !== type) {
    failType(type, value, base);
  }
}
