'use strict';

const { assertType, typeOf } = require('./util');
const { lookup, registerType, registerValue } = require('./registry');
const { objectVerifyer } = require('./object-verifyer');
const { validator } = require('./validator');

exports.object = object;

registerType('Object', object);
registerValue(object, validator(isObject, 'object'));

function object(spec) {
  assertType(spec, 'Object');
  const tests = lookupAll(spec);

  return validator(
    objectTester(tests),
    objectSpecName(spec),
    objectVerifyer(tests)
  );
}

function isObject(value) {
  return typeOf(value) === 'Object';
}

function objectTester(tests) {
  return (value) =>
    isObject(value) &&
    Object.keys(tests).every((key) => tests[key](value[key], key)) &&
    Object.keys(value).every((key) => Boolean(tests[key]));
}

function objectSpecName(spec) {
  return () => {
    const p = Object.keys(spec).map((key) => `${key}:${spec[key]}`);
    return `{${p.join(', ')}}`;
  };
}

function lookupAll(spec) {
  const tests = {};
  for (const key of Object.keys(spec)) {
    tests[key] = lookup(spec[key]);
  }
  return tests;
}
