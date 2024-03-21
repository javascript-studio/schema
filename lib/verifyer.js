'use strict';

const { failType } = require('./util');

exports.verifyer = verifyer;

/**
 * @typedef {null | boolean | number | string} LiteralValue
 * @typedef {undefined | LiteralValue | ArrayValue | ObjectValue} Value
 * @typedef {Value[]} ArrayValue
 * @typedef {{ [k: string]: Value }} ObjectValue
 */

/**
 * @template V
 * @callback Tester
 * @param {V} value
 * @param {string | null} [base]
 * @returns {boolean | undefined}
 */

/**
 * @typedef SchemaOptions
 * @property {string} [error_code]
 */

/**
 * @template V
 * @callback Verifyer
 * @param {V} value
 * @param {SchemaOptions} [options]
 * @param {string} [base]
 * @returns {V}
 */

/**
 * @template V
 * @param {Tester<V>} test
 * @returns {Verifyer<V>}
 */
function verifyer(test) {
  return (value, options = {}, base = undefined) => {
    if (test(value, base) === false) {
      failType(test.toString(), value, base, options.error_code);
    }
    return value;
  };
}
