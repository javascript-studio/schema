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
  return () => `{${keyTest}:${valueTest}}`;
}

function keyVerifyer(keyTest) {
  return (key, options, base = undefined) => {
    let actual_key = key;
    if (keyTest.type === 'integer') {
      actual_key = parseInt(key, 10);
      if (String(actual_key) !== key) {
        failSchemaValidation(
          new TypeError(
            base && base !== key
              ? `Expected key "${key}" in "${base}" to be an integer string`
              : `Expected key "${key}" to be an integer string`
          ),
          options.error_code
        );
      }
    }
    if (keyTest(actual_key, options, base) === false) {
      failSchemaValidation(
        new TypeError(
          base && base !== key
            ? `Expected key "${key}" in "${base}" to be ${keyTest}`
            : `Expected key "${key}" to be ${keyTest}`
        ),
        options.error_code
      );
    }
    return base;
  };
}
