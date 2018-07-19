'use strict';

function stringify(value) {
  if (typeof value === 'function') {
    return 'function';
  }
  return JSON.stringify(value);
}

function fail(name, value) {
  if (name) {
    throw new TypeError(`Expected ${name} but got ${stringify(value)}`);
  }
  throw new TypeError(`Unexpected ${stringify(value)}`);
}

function custom(fn, name) {
  return (value) => {
    if (fn(value) === false) {
      fail(name, value);
    }
  };
}

const isTypeOf = type => custom(v => v !== null && typeof v === type, type);
const isInteger = v => Math.floor(v) === v;
const isNull = v => v === null;

const string_specs = {
  integer: custom(isInteger, 'integer')
};
['boolean', 'number', 'string', 'object']
  .forEach(type => (string_specs[type] = isTypeOf(type)));

function spec(spec, name) {
  if (spec === null) {
    return custom(isNull, 'null');
  }
  if (typeof spec === 'function') {
    return custom(spec, name);
  }
  const schema = string_specs[spec];
  if (schema) {
    return schema;
  }
  throw new Error(`Invalid spec ${stringify(spec)}`);
}

spec.spec = spec;

module.exports = spec;
