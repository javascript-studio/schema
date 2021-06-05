'use strict';

const { type } = require('./type');
const { specTests, specTestInjectObject } = require('./spec-test');
const { specName } = require('./spec-name');
const { objectVerifyer } = require('./object-verifyer');
const { validator } = require('./validator');

exports.object = object;

specTestInjectObject(object);

function object(spec) {
  type.object.verify(spec);
  const tests = specTests(spec);

  return validator(
    objectTester(tests),
    objectSpecName(spec),
    objectVerifyer(tests)
  );
}

function objectTester(tests) {
  return (value) =>
    type.object(value) &&
    Object.keys(tests).every((key) => tests[key](value[key], key)) &&
    Object.keys(value).every((key) => Boolean(tests[key]));
}

function objectSpecName(spec) {
  return () => specName(spec);
}
