'use strict';

const { CUSTOM_VALIDATOR } = require('./constants');
const { verifyer } = require('./verifyer');

/**
 * @typedef {import('./verifyer').SchemaValue} SchemaValue
 */
/**
 * @template {SchemaValue} T
 * @typedef {import('./verifyer').Tester<T>} Tester
 */
/**
 * @template {SchemaValue} T
 * @typedef {import('./verifyer').Verifyer<T>} Verifyer
 */

exports.validator = validator;

/**
 * @template {SchemaValue} T
 * @typedef ValidatorProps
 * @property {Verifyer<T>} verify
 */
/**
 * @template {SchemaValue} T
 * @typedef {Tester<T> & ValidatorProps<T>} Validator
 */

/**
 * @template {SchemaValue} T
 * @param {Tester<T>} test
 * @param {string | (() => string)} [toString]
 * @param {Verifyer<T>} [verify]
 * @returns {Validator<T>}
 */
function validator(test, toString, verify = verifyer(test)) {
  if (typeof toString === 'function') {
    test.toString = toString;
  } else {
    test.toString = () => toString || test.name || CUSTOM_VALIDATOR;
  }
  test['verify'] = verify;
  return /** @type {Validator<T>} */ (test);
}
