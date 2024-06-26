'use strict';

const { validator } = require('./validator');
const { verifyer } = require('./verifyer');
const { lazy } = require('./util');

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

exports.all = all;

/**
 * @template {Value} V
 * @typedef {Validator<V> & { validators: Validator<V>[]}} All
 */

/**
 * @template {Value} V
 * @param {Validator<V>[]} tests
 * @returns {All<V>}
 */
function all(...tests) {
  if (tests.length < 2) {
    throw new Error('Require at least two arguments');
  }

  const tester = allTester(tests);
  const test = /** @type {All<V>} */ (
    validator(tester, allValidatorName(tests), allVerifyer(tester, tests))
  );
  test.validators = tests;
  return test;
}

/**
 * @template {Value} V
 * @param {Validator<V>[]} tests
 * @returns {Tester<V>}
 */
function allTester(tests) {
  return (value) => tests.every((test) => test(value));
}

/**
 * @template {Value} V
 * @param {Validator<V>[]} tests
 * @returns {() => string}
 */
function allValidatorName(tests) {
  return () => `all(${tests.join(', ')})`;
}

/**
 * @template {Value} V
 * @param {Tester<V>} tester
 * @param {Validator<V>[]} tests
 * @returns {Verifyer<V>}
 */
function allVerifyer(tester, tests) {
  const verify = verifyer(tester);
  lazy(verify, 'read', () => createAllReaderWriter(verify, tests, 'read'));
  lazy(verify, 'write', () => createAllReaderWriter(verify, tests, 'write'));
  return verify;
}

/**
 * @template {Value} V
 * @param {Verifyer<V>} verify
 * @param {Validator<V>[]} tests
 * @param {'read' | 'write'} method
 * @returns {Verifyer<V>}
 */
function createAllReaderWriter(verify, tests, method) {
  return (value, options = {}, base = undefined) => {
    verify(value, options);
    for (const test of tests) {
      const readOrWrite = test.verify[method];
      if (readOrWrite) {
        return readOrWrite(value, options, base);
      }
    }
    return undefined;
  };
}
