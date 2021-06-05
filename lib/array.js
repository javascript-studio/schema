'use strict';

const { assertType } = require('./assert-type');
const { typeOf } = require('./type-of');
const { failSpec } = require('./fail');
const { specName } = require('./spec-name');
const { specTest, specTestInjectArray } = require('./spec-test');
const { arrayVerifyer } = require('./array-verifyer');
const { validator } = require('./validator');

exports.array = array;

specTestInjectArray((spec) => {
  assertType(spec, 'Array');
  return (spec.length === 1 && array(spec[0])) || failSpec(spec);
});

function array(spec) {
  const itemTest = spec.verify ? spec : specTest(spec);

  return validator(
    arrayTester(itemTest),
    arraySpecName(spec),
    arrayVerifyer(itemTest, spec)
  );
}

function arrayTester(itemTest) {
  return (value) => typeOf(value) === 'Array' && value.every(itemTest);
}

function arraySpecName(spec) {
  return () => `[${specName(spec)}]`;
}
