'use strict';

const { validator } = require('./validator');
const {
  assertValidator,
  copyPropertyDescriptor,
  copyTypeAndProperties
} = require('./util');

/**
 * @typedef {import('./verifyer').Value} Value
 */
/**
 * @template {Value} V
 * @typedef {import('./verifyer').Tester<V>} Tester
 */
/**
 * @template {Value} V
 * @typedef {import('./verifyer').Verifyer<V>} Verifyer
 */
/**
 * @template {Value} V
 * @typedef {import('./validator').Validator<V>} Validator
 */

exports.opt = opt;

/**
 * @template {Validator<*>} V
 * @typedef {V & Validator<Parameters<V>[0] | undefined> & { optional: true }} Opt
 */

/**
 * @template {Validator<*>} V
 * @param {V} optTest
 * @returns {Opt<V>}
 */
function opt(optTest) {
  assertValidator(optTest);
  const wrapped = /** @type {Opt<V>} */ (
    validator(
      optTester(optTest),
      optValidatorName(optTest),
      optVerifyer(optTest)
    )
  );
  wrapped.optional = true;
  copyTypeAndProperties(optTest, wrapped);
  return wrapped;
}

/**
 * @template {Validator<*>} V
 * @param {V} test
 * @returns {Tester<Parameters<V>[0]>}
 */
function optTester(test) {
  return (value) => value === undefined || test(value);
}

/**
 * @template {Validator<*>} V
 * @param {V} test
 * @returns {() => string}
 */
function optValidatorName(test) {
  return () => `undefined or ${test}`;
}

/**
 * @template {Validator<*>} V
 * @param {V} test
 * @returns {Verifyer<Parameters<V>[0]>}
 */
function optVerifyer(test) {
  const verify = /** @type {Verifyer<V>} */ (
    value,
    options = {},
    base = undefined
  ) => (value === undefined ? value : test.verify(value, options, base));
  copyPropertyDescriptor(test.verify, 'read', verify);
  copyPropertyDescriptor(test.verify, 'write', verify);
  return verify;
}
