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
    mapSpecName(key_spec, value_spec),
    mapVerifyer(keyVerifyer(keyTest, key_spec), valueTest)
  );
}

function mapTester(keyTest, valueTest) {
  return (value) =>
    typeOf(value) === 'Object' &&
    Object.keys(value).every((key) => keyTest(key) && valueTest(value[key]));
}

function mapSpecName(key_spec, value_spec) {
  return () => `map(${specName(key_spec)}, ${specName(value_spec)})`;
}

function keyVerifyer(fn, spec) {
  return (key, property) => {
    if (fn(key, property) === false) {
      failSchemaValidation(
        new TypeError(
          property && property !== key
            ? `Expected key "${key}" in "${property}" to be ${specName(spec)}`
            : `Expected key "${key}" to be ${specName(spec)}`
        )
      );
    }
    return property;
  };
}
