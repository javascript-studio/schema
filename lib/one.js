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
/**
 * @template {Validator<*>} V
 * @typedef {import('./validator').VParameter<V>} VParameter
 */

exports.one = one;

/**
 * @template {Validator<*>[]} V
 * @typedef {{ [I in keyof V]: VParameter<V[I]> }} OneParameters
 */
/**
 * @template {Validator<*>[]} V
 * @typedef {Validator<OneParameters<V>[number]> & { validators: V }} One
 */

/**
 * @template {Validator<*>[]} V
 * @param {V} tests
 * @returns {One<V>}
 */
function one(...tests) {
  if (tests.length < 2) {
    throw new Error('Require at least two arguments');
  }

  const tester = oneTester(tests);
  const test = /** @type {One<V>} */ (
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
 * @template {Value} V
 * @param {Validator<V>[]} tests
 * @returns {function(): string}
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
    verify(value, options);
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
