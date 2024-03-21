'use strict';

const { typeOf, assertValidator } = require('./util');
const { arrayVerifyer } = require('./array-verifyer');
const { validator } = require('./validator');

/**
 * @typedef {import('./verifyer').Value} Value
 */
/**
 * @template {Value} V
 * @typedef {import('./verifyer').Tester<V>} Tester
 */
/**
 * @template {Value} V
 * @typedef {import('./validator').Validator<V>} Validator
 */

exports.array = array;

/**
 * @template {Validator<*>} V
 * @typedef {Validator<Array<Parameters<V>[0]>> & { type: 'Array', items: V }} VArray
 */

/**
 * @template {Validator<*>} V
 * @param {V} itemTest
 * @returns {VArray<V>}
 */
function array(itemTest) {
  assertValidator(itemTest);

  const test = /** @type {VArray<V>} */ (
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

array.any = /** @type {VArray<*>} */ (validator(isArray, 'array'));

/**
 * @param {Value} value
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
