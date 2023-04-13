'use strict';

const { typeOf, assertValidator } = require('./util');
const { arrayVerifyer } = require('./array-verifyer');
const { validator } = require('./validator');

/**
 * @typedef {import('./verifyer').SchemaValue} SchemaValue
 */
/**
 * @template {SchemaValue} V
 * @typedef {import('./verifyer').Tester<V>} Tester
 */
/**
 * @template {SchemaValue} V
 * @typedef {import('./validator').Validator<V>} Validator
 */

exports.array = array;

/**
 * @template {Validator<*>} V
 * @typedef ArrayProps
 * @property {'Array'} type
 * @property {V} items
 */
/**
 * @template {Validator<*>} V
 * @typedef {Validator<Array<Parameters<V>[0]>> & ArrayProps<V>} ArrayValidator
 */

/**
 * @template {Validator<*>} V
 * @param {V} itemTest
 * @returns {ArrayValidator<V>}
 */
function array(itemTest) {
  assertValidator(itemTest);

  const test = /** @type {ArrayValidator<V>} */ (
    validator(
      arrayTester(itemTest),
      arrayValidatorName(itemTest),
      arrayVerifyer(itemTest)
    )
  );
  test.type = 'Array';
  test.items = itemTest;
  return test;
}

array.any = /** @type {ArrayValidator<*>} */ (validator(isArray, 'array'));

/**
 * @param {SchemaValue} value
 * @returns {boolean}
 */
function isArray(value) {
  return typeOf(value) === 'Array';
}

/**
 * @template {Validator<*>} V
 * @param {V} itemTest
 * @returns {Tester<Array<Parameters<V>>>}
 */
function arrayTester(itemTest) {
  return (value) => isArray(value) && value.every((v) => itemTest(v));
}

/**
 * @template {Validator<*>} V
 * @param {V} itemTest
 * @returns {() => string}
 */
function arrayValidatorName(itemTest) {
  return () => `[${itemTest}]`;
}
