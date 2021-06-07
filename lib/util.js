'use strict';

const { SPEC_NAME, CUSTOM_VALIDATOR } = require('./constants');
const { typeOf } = require('./type-of');
const { failNotSchemaObject, failType } = require('./fail');

exports.objectPath = objectPath;
exports.arrayPath = arrayPath;
exports.raw = raw;
exports.unwrap = unwrap;
exports.assertType = assertType;
exports.lazy = lazy;
exports.specName = specName;

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

function lazy(object, property, factory) {
  let cache;
  Object.defineProperty(object, property, {
    get: () => cache || (cache = factory())
  });
}

function specName(spec) {
  return spec[SPEC_NAME] || CUSTOM_VALIDATOR;
}
