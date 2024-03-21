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
/**
 * @template {Validator<*>} V
 * @typedef {import('./validator').VParameter<V>} VParameter
 */

exports.opt = opt;

/**
 * @template {Validator<*>} V
 * @typedef {V & Validator<VParameter<V> | undefined> & { optional: true }} Opt
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
 * @returns {Tester<VParameter<V>>}
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
 * @returns {Verifyer<VParameter<V>>}
 */
function optVerifyer(test) {
  const verify = /** @type {Verifyer<VParameter<V>>} */ (
    value,
    options = {},
    base = undefined
  ) => (value === undefined ? value : test.verify(value, options, base));
  copyPropertyDescriptor(test.verify, 'read', verify);
  copyPropertyDescriptor(test.verify, 'write', verify);
  return verify;
}
