'use strict';

const { type } = require('./type');
const { typeOf } = require('./type-of');
const { failSpec } = require('./fail');
const { verifyer } = require('./verifyer');

exports.specTest = specTest;
exports.specTests = specTests;
exports.specTestInjectObject = injectObject;
exports.specTestInjectArray = injectArray;

const spec_type = {
  Null: () => type.null,
  Boolean: (spec) => spec ? type.defined : type.optional,
  String: (spec) => type[spec] || failSpec(spec),
  RegExp: regexp,
  Object: null,
  Array: null,
  Function: (spec) => spec.verify ? spec : func(spec)
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
  const funcTest = (value, property) => spec(value, property);
  funcTest.verify = verifyer(funcTest, spec);
  return funcTest;
}

function regexp(spec) {
  const regexpTest = (value) => typeof value === 'string' && spec.test(value);
  regexpTest.verify = verifyer(regexpTest, spec);
  return regexpTest;
}

function injectObject(object) {
  spec_type.Object = object;
}

function injectArray(array) {
  spec_type.Array = array;
}
