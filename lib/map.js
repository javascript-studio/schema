'use strict';

const { typeOf, failSchemaValidation, assertValidator } = require('./util');
const { mapVerifyer } = require('./map-verifyer');
const { validator } = require('./validator');

/**
 * @typedef {import('./verifyer').Value} Value
 */
/**
 * @template {Value} V
 * @typedef {import('./validator').Validator<V>} Validator
 */
/**
 * @template {Validator<*>} V
 * @typedef {import('./validator').VParameter<V>} VParameter
 */
/**
 * @typedef {import('./literal').Literal<*>} Literal
 */

exports.map = map;

/* eslint-disable jsdoc/valid-types */
/**
 * @template {Validator<*>} K
 * @typedef {K extends Literal ? string : VParameter<K>} VKey
 */
/* eslint-enable */
/**
 * @template {Validator<*>} K
 * @template {Validator<*>} V
 * @typedef {Validator<Record<VKey<K>, VParameter<V>>> & { type: 'Map', keys: K, values: V }} VMap
 */

/**
 * @template {Validator<*>} K
 * @template {Validator<*>} V
 * @param {K} keyTest
 * @param {V} valueTest
 * @returns {VMap<K, V>}
 */
function map(keyTest, valueTest) {
  assertValidator(keyTest);
  assertValidator(valueTest);

  const test = /** @type {VMap<K, V>} */ (
    validator(
      mapTester(keyTest, valueTest),
      mapValidatorName(keyTest, valueTest),
      mapVerifyer(keyVerifyer(keyTest), valueTest)
    )
  );
  test.type = 'Map';
  test.keys = keyTest;
  test.values = valueTest;
  return test;
}

function mapTester(keyTest, valueTest) {
  const actualKeyTest =
    keyTest.type === 'integer' ? integerKeyTest(keyTest) : keyTest;
  return (value) =>
    typeOf(value) === 'Object' &&
    Object.keys(value).every(
      (key) => actualKeyTest(key) && valueTest(value[key])
    );
}

function integerKeyTest(keyTest) {
  return (key) => {
    const integer_key = parseInt(key, 10);
    return String(integer_key) === key && keyTest(integer_key);
  };
}

function mapValidatorName(keyTest, valueTest) {
  return () => `{${keyTest}:${valueTest}}`;
}

function keyVerifyer(keyTest) {
  return (key, options, base) => {
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
