'use strict';

const { typeOf } = require('./type-of');
const { specName } = require('./spec-name');
const { specTest } = require('./spec-test');
const { failSchemaValidation } = require('./fail');
const { mapVerifyer } = require('./map-verifyer');
const { validator } = require('./validator');

exports.map = map;

function map(key_spec, value_spec) {
  const keyTest = specTest(key_spec);
  const valueTest = specTest(value_spec);

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
  return () => `map(${specName(keyTest)}, ${specName(valueTest)})`;
}

function keyVerifyer(keyTest) {
  return (key, property) => {
    if (keyTest(key, property) === false) {
      const expectation = specName(keyTest);
      failSchemaValidation(
        new TypeError(
          property && property !== key
            ? `Expected key "${key}" in "${property}" to be ${expectation}`
            : `Expected key "${key}" to be ${expectation}`
        )
      );
    }
    return property;
  };
}
