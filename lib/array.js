'use strict';

const { lazy } = require('./lazy');
const { type } = require('./type');
const { specName, SPEC_NAME } = require('./spec-name');
const { specTest } = require('./spec-test');
const { arrayVerifyer } = require('./array-verifyer');

exports.array = array;

function array(spec) {
  const itemTest = spec.verify ? spec : specTest(spec);

  const arrayTest = arrayTester(itemTest);
  arrayTest.verify = arrayVerifyer(itemTest, spec);
  lazy(arrayTest, SPEC_NAME, () => `array(${specName(spec)})`);

  return arrayTest;
}

function arrayTester(itemTest) {
  return (value) => type.array(value) && value.every(itemTest);
}
