'use strict';

const { stringify } = require('./stringify');
const { SCHEMA_VALIDATION } = require('./constants');

exports.failSchemaValidation = failSchemaValidation;
exports.failSet = failSet;
exports.failDelete = failDelete;
exports.failNotSchemaObject = failNotSchemaObject;
exports.failSpec = failSpec;

function failSchemaValidation(error) {
  throw Object.defineProperty(error, 'code', { value: SCHEMA_VALIDATION });
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

