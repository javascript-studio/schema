'use strict';

const { failType } = require('./util');

exports.verifyer = verifyer;

/**
 * @typedef {null | boolean | number | string} SchemaLiteral
 * @typedef {undefined | SchemaLiteral | SchemaArrayValue | SchemaObjectValue} SchemaValue
 * @typedef {SchemaValue[]} SchemaArrayValue
 * @typedef {{ [k: string]: SchemaValue }} SchemaObjectValue
 */
/**
 * @typedef {Object} Emitter
 * @property {function(string, *): boolean | void} emit
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
 * @template {SchemaValue} V
 * @typedef WithToJSON
 * @property {() => V} toJSON
 */
/**
 * @template {SchemaValue} V
 * @typedef {V & WithToJSON<V>} SchemaReader
 */
/**
 * @template {SchemaValue} V
 * @typedef {V & WithToJSON<V>} SchemaWriter
 */
/**
 * @template {SchemaValue} V
 * @typedef WriterOptions
 * @property {Emitter} [emitter]
 */
/**
 * @template {SchemaValue} V
 * @callback SchemaRead
 * @param {V} value
 * @returns {SchemaReader<V>}
 */
/* eslint-disable jsdoc/valid-types */
/**
 * @template {SchemaValue} V
 * @typedef {V extends SchemaObjectValue ? { [K in keyof V]?: RecursivePartial<V[K]> } : V} RecursivePartial
 */
/* eslint-enable */
/**
 * @template {SchemaValue} V
 * @callback SchemaWrite
 * @param {RecursivePartial<V>} value
 * @param {WriterOptions<V>} [options]
 * @returns {SchemaWriter<V>}
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
