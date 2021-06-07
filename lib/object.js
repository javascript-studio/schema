'use strict';

const { assertType, specName, typeOf } = require('./util');
const { lookup, registerSpecType } = require('./spec-test');
const { objectVerifyer } = require('./object-verifyer');
const { validator } = require('./validator');

exports.object = object;

registerSpecType('Object', object);

function object(spec) {
  assertType(spec, 'Object');
  const tests = lookupAll(spec);

  return validator(
    objectTester(tests),
    objectSpecName(spec),
    objectVerifyer(tests)
  );
}

function objectTester(tests) {
  return (value) =>
    typeOf(value) === 'Object' &&
    Object.keys(tests).every((key) => tests[key](value[key], key)) &&
    Object.keys(value).every((key) => Boolean(tests[key]));
}

function objectSpecName(spec) {
  return () => {
    const p = Object.keys(spec).map((key) => `${key}:${specName(spec[key])}`);
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
