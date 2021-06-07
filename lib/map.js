'use strict';

const { typeOf, failSchemaValidation } = require('./util');
const { lookup } = require('./registry');
const { mapVerifyer } = require('./map-verifyer');
const { validator } = require('./validator');

exports.map = map;

function map(key_spec, value_spec) {
  const keyTest = lookup(key_spec);
  const valueTest = lookup(value_spec);

  return validator(
    mapTester(keyTest, valueTest),
    mapSpecName(keyTest, valueTest),
    mapVerifyer(keyVerifyer(keyTest), valueTest)
  );
}

function mapTester(keyTest, valueTest) {
  return (value) =>
    typeOf(value) === 'Object' &&
    Object.keys(value).every((key) => keyTest(key) && valueTest(value[key]));
}

function mapSpecName(keyTest, valueTest) {
  return () => `map(${keyTest}, ${valueTest})`;
}

function keyVerifyer(keyTest) {
  return (key, property) => {
    if (keyTest(key, property) === false) {
      failSchemaValidation(
        new TypeError(
          property && property !== key
            ? `Expected key "${key}" in "${property}" to be ${keyTest}`
            : `Expected key "${key}" to be ${keyTest}`
        )
      );
    }
    return property;
  };
}
