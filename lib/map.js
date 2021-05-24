'use strict';

const { lazy } = require('./lazy');
const { type } = require('./type');
const { specName, SPEC_NAME } = require('./spec-name');
const { specTest } = require('./spec-test');
const { failSchemaValidation } = require('./fail');
const { mapVerifyer } = require('./map-verifyer');

exports.map = map;

function map(key_spec, value_spec) {
  const keyTest = specTest(key_spec);
  const valueTest = specTest(value_spec);

  const mapTest = mapTester(keyTest, valueTest);
  mapTest.verify = mapVerifyer(keyVerifyer(keyTest, key_spec), valueTest);
  lazy(mapTest, SPEC_NAME,
    () => `map(${specName(key_spec)}, ${specName(value_spec)})`);

  return mapTest;
}

function mapTester(keyTest, valueTest) {
  return (value) => type.object(value)
    && Object.keys(value).every(key => keyTest(key) && valueTest(value[key]));
}

function keyVerifyer(fn, spec) {
  return (key, property) => {
    if (fn(key, property) === false) {
      failSchemaValidation(new TypeError(property && property !== key
        ? `Expected key "${key}" in "${property}" to be ${specName(spec)}`
        : `Expected key "${key}" to be ${specName(spec)}`));
    }
    return property;
  };
}
