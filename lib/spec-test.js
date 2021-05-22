'use strict';

const { lazy } = require('./lazy');
const { type } = require('./type');
const { typeOf } = require('./type-of');
const { SPEC_NAME } = require('./spec-name');
const { failSpec } = require('./fail');
const { verifyer } = require('./verifyer');

exports.specTest = specTest;
exports.specTests = specTests;
exports.specTestInjectObject = injectObject;

const spec_type = {
  Null: () => type.null,
  Boolean: spec => spec ? type.defined : type.optional,
  String: spec => type[spec] || failSpec(spec),
  RegExp: regexp,
  Object: null,
  Function: spec => spec.verify ? spec : func(spec)
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
  const t = spec[SPEC_NAME] ? spec : (value, property) => spec(value, property);
  return lazy(t, 'verify', () => verifyer(t, spec));
}

function regexp(spec) {
  const t = v => typeof v === 'string' && spec.test(v);
  return lazy(t, 'verify', () => verifyer(t, spec));
}

function injectObject(object) {
  spec_type.Object = object;
}
