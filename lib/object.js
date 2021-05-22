'use strict';

const { lazy } = require('./lazy');
const { type } = require('./type');
const { stringify } = require('./stringify');
const { specTests, specTestInjectObject } = require('./spec-test');
const { specName, SPEC_NAME } = require('./spec-name');
const { objectVerifyer } = require('./object-verifyer');

exports.object = object;

specTestInjectObject(objectTest);

function object(spec) {
  if (!type.object(spec)) {
    throw new TypeError(`Expected object but got ${stringify(spec)}`);
  }
  const test = objectTest(spec);
  return lazy(test, SPEC_NAME, () => `object(${specName(spec)})`);
}

function objectTest(spec) {
  const tests = specTests(spec);
  const test = objectTester(tests);
  return lazy(test, 'verify', () => objectVerifyer(tests));
}

function objectTester(tests) {
  return (value) => type.object(value)
    && Object.keys(tests).every(key => tests[key](value[key], key))
    && Object.keys(value).every(key => Boolean(tests[key]));
}
