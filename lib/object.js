'use strict';

const { typeOf } = require('./type-of');
const { assertType } = require('./assert-type');
const { specTests, registerSpecType } = require('./spec-test');
const { specName } = require('./spec-name');
const { objectVerifyer } = require('./object-verifyer');
const { validator } = require('./validator');

exports.object = object;

registerSpecType('Object', object);

function object(spec) {
  assertType(spec, 'Object');
  const tests = specTests(spec);

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
  return () => specName(spec);
}
