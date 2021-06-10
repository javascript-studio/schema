'use strict';

const { SCHEMA_VALIDATION } = require('./constants');

exports.objectPath = objectPath;
exports.arrayPath = arrayPath;
exports.raw = raw;
exports.unwrap = unwrap;
exports.assertType = assertType;
exports.lazy = lazy;
exports.typeOf = typeOf;
exports.stringify = stringify;

exports.failSchemaValidation = failSchemaValidation;
exports.failType = failType;
exports.failSet = failSet;
exports.failDelete = failDelete;
exports.failNotSchemaObject = failNotSchemaObject;
exports.failSpec = failSpec;

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

function typeOf(value) {
  const str = Object.prototype.toString.call(value);
  return str.substring(8, str.length - 1);
}

const serialize = {
  Function: () => 'function',
  Number: String, // NaN and Infinity
  RegExp: String,
  Arguments: String
};

function stringify(value) {
  return (serialize[typeOf(value)] || JSON.stringify)(value);
}

function failSchemaValidation(error) {
  throw Object.defineProperty(error, 'code', { value: SCHEMA_VALIDATION });
}

function failType(expected, value, property) {
  if (property && value === undefined) {
    failSchemaValidation(new TypeError(`Missing property "${property}"`));
  }
  const expectation = `${expected} but got ${stringify(value)}`;
  failSchemaValidation(
    new TypeError(
      property
        ? `Expected property "${property}" to be ${expectation}`
        : `Expected ${expectation}`
    )
  );
}

function failSet() {
  failSchemaValidation(new Error('Invalid assignment on read-only object'));
}

function failDelete() {
  failSchemaValidation(new Error('Invalid delete on read-only object'));
}

function failNotSchemaObject() {
  throw new TypeError('Argument is not a schema reader or writer');
}

function failSpec(spec) {
  throw new TypeError(`Invalid spec ${stringify(spec)}`);
}
