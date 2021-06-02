'use strict';

const { lazy } = require('./lazy');
const { type } = require('./type');
const { failSpec } = require('./fail');
const { specName, SPEC_NAME } = require('./spec-name');
const { specTest, specTestInjectArray } = require('./spec-test');
const { arrayVerifyer } = require('./array-verifyer');

exports.array = array;

specTestInjectArray((spec) => {
  type.array.verify(spec);
  return (spec.length === 1 && array(spec[0])) || failSpec(spec);
});

function array(spec) {
  const itemTest = spec.verify ? spec : specTest(spec);

  const arrayTest = arrayTester(itemTest);
  arrayTest.verify = arrayVerifyer(itemTest, spec);
  lazy(arrayTest, SPEC_NAME, () => `[${specName(spec)}]`);

  return arrayTest;
}

function arrayTester(itemTest) {
  return (value) => type.array(value) && value.every(itemTest);
}
