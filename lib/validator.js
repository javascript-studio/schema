'use strict';

const { CUSTOM_VALIDATOR } = require('./constants');
const { verifyer } = require('./verifyer');

/**
 * @typedef {import('./verifyer').Value} Value
 */
/**
 * @template {Value} T
 * @typedef {import('./verifyer').Tester<T>} Tester
 */
/**
 * @template {Value} T
 * @typedef {import('./verifyer').Verifyer<T>} Verifyer
 */

exports.validator = validator;

/**
 * @template {Value} V
 * @typedef {Tester<V> & { verify: Verifyer<V> }} Validator
 */

/* eslint-disable jsdoc/valid-types */
/**
 * @template {Validator<*>} V
 * @typedef {V extends Validator<infer K> ? K : never} VParameter
 */
/** eslint-enable jsdoc/valid-types */

/**
 * @template {Value} T
 * @param {Tester<T>} test
 * @param {string | (function(): string)} [toString]
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
