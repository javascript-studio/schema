'use strict';

const { typeOf } = require('./type-of');
const { failSpec } = require('./fail');
const { specName } = require('./spec-name');
const { validator } = require('./validator');
const { literal } = require('./literal');

exports.specTest = specTest;
exports.specTests = specTests;
exports.specTestInjectObject = injectObject;
exports.specTestInjectArray = injectArray;

const spec_type = {
  Null: () => literal(null),
  RegExp: regexp,
  Object: null,
  Array: null,
  Function: func
};

function specTest(spec) {
  return (spec_type[typeOf(spec)] || failSpec)(spec);
}

function specTests(spec) {
  const tests = {};
  for (const key of Object.keys(spec)) {
    tests[key] = specTest(spec[key]);
  }
  return tests;
}

function func(spec) {
  if (spec.verify) {
    return spec;
  }
  const funcTest = funcTester(spec);

  return validator(funcTest, funcSpecName(spec));
}

function funcTester(spec) {
  return (value, property) => spec(value, property);
}

function funcSpecName(spec) {
  return () => specName(spec);
}

function regexp(spec) {
  const regexpTest = regexpTester(spec);

  return validator(regexpTest, String(spec));
}

function regexpTester(spec) {
  return (value) => typeof value === 'string' && spec.test(value);
}

function injectObject(object) {
  spec_type.Object = object;
}

function injectArray(array) {
  spec_type.Array = array;
}
