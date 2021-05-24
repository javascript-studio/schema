'use strict';

const { lazy } = require('./lazy');
const { type } = require('./type');
const { stringify } = require('./stringify');
const { specTests, specTestInjectObject } = require('./spec-test');
const { specName, SPEC_NAME } = require('./spec-name');
const { objectVerifyer } = require('./object-verifyer');

exports.object = object;

specTestInjectObject(object);

function object(spec) {
  if (!type.object(spec)) {
    throw new TypeError(`Expected object but got ${stringify(spec)}`);
  }
  const tests = specTests(spec);

  const objectTest = objectTester(tests);
  objectTest.verify = objectVerifyer(tests);
  lazy(objectTest, SPEC_NAME, () => `object(${specName(spec)})`);

  return objectTest;
}

function objectTester(tests) {
  return (value) => type.object(value)
    && Object.keys(tests).every(key => tests[key](value[key], key))
    && Object.keys(value).every(key => Boolean(tests[key]));
}
