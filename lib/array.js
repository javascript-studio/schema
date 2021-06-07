'use strict';

const { assertType, typeOf, failSpec } = require('./util');
const { lookup, registerType, registerValue } = require('./registry');
const { arrayVerifyer } = require('./array-verifyer');
const { validator } = require('./validator');

exports.array = array;

registerType('Array', (spec) => {
  assertType(spec, 'Array');
  return (spec.length === 1 && array(spec[0])) || failSpec(spec);
});
registerValue(array, validator(isArray, 'array'));

function array(spec) {
  const itemTest = spec.verify ? spec : lookup(spec);

  return validator(
    arrayTester(itemTest),
    arraySpecName(itemTest),
    arrayVerifyer(itemTest, spec)
  );
}

function isArray(value) {
  return typeOf(value) === 'Array';
}

function arrayTester(itemTest) {
  return (value) => isArray(value) && value.every(itemTest);
}

function arraySpecName(itemTest) {
  return () => `[${itemTest}]`;
}
