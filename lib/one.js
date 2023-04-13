'use strict';

const { validator } = require('./validator');
const { verifyer } = require('./verifyer');
const { lazy } = require('./util');

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

exports.one = one;

/**
 * @template {Validator<*>[]} V
 * @typedef OneProps
 * @property {V} validators
 */
/**
 * @template {Validator<*>[]} V
 * @typedef {{ [I in keyof V]: Parameters<V[I]>[0] }} OneParameters
 */
/**
 * @template {Validator<*>[]} V
 * @typedef {Validator<OneParameters<V>[number]> & OneProps<V>} OneValidator
 */

/**
 * @template {Validator<*>[]} V
 * @param {V} tests
 * @returns {OneValidator<V>}
 */
function one(...tests) {
  if (tests.length < 2) {
    throw new Error('Require at least two arguments');
  }

  const tester = oneTester(tests);
  const test = /** @type {OneValidator<V>} */ (
    validator(tester, oneValidatorName(tests), oneVerifyer(tester, tests))
  );
  test.validators = tests;
  return test;
}

/**
 * @template {Validator<*>[]} V
 * @param {V} tests
 * @returns {Tester<OneParameters<V>[number]>}
 */
function oneTester(tests) {
  return (value) => tests.some((test) => test(value));
}

/**
 * @template {SchemaValue} V
 * @param {Validator<V>[]} tests
 * @returns {() => string}
 */
function oneValidatorName(tests) {
  return () => `one(${tests.join(', ')})`;
}

/**
 * @template {Validator<*>[]} V
 * @param {Tester<OneParameters<V>[number]>} tester
 * @param {V} tests
 * @returns {Verifyer<OneParameters<V>[number]>}
 */
function oneVerifyer(tester, tests) {
  const verify = verifyer(tester);
  lazy(verify, 'read', () => createOneReaderWriter(verify, tests, 'read'));
  lazy(verify, 'write', () => createOneReaderWriter(verify, tests, 'write'));
  return verify;
}

function createOneReaderWriter(verify, tests, method) {
  return (value, options = {}, base = undefined) => {
    verify(value);
    for (const test of tests) {
      const readOrWrite = test.verify[method];
      if (readOrWrite) {
        try {
          return readOrWrite(value, options, base);
        } catch (ignore) {
          // Continue loop
        }
      }
    }
    return undefined;
  };
}
