'use strict';

const { validator } = require('./validator');
const {
  assertValidator,
  copyPropertyDescriptor,
  copyTypeAndProperties
} = require('./util');

/**
 * @typedef {import('./verifyer').SchemaValue} SchemaValue
 */
/**
 * @template {SchemaValue} V
 * @typedef {import('./verifyer').Tester<V>} Tester
 */
/**
 * @template {SchemaValue} V
 * @typedef {import('./verifyer').Verifyer<V>} Verifyer
 */
/**
 * @template {SchemaValue} V
 * @typedef {import('./validator').Validator<V>} Validator
 */

exports.opt = opt;

/**
 * @typedef OptProps
 * @property {true} optional
 */

/**
 * @template {Validator<*>} V
 * @typedef {V & Validator<Parameters<V>[0] | undefined> & OptProps} OptValidator
 */

/**
 * @template {Validator<*>} V
 * @param {V} optTest
 * @returns {OptValidator<V>}
 */
function opt(optTest) {
  assertValidator(optTest);
  const wrapped = /** @type {OptValidator<V>} */ (
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
