'use strict';

const { validator } = require('./validator');

/**
 * @typedef {import('./verifyer').SchemaValue} SchemaValue
 */
/**
 * @template {SchemaValue} V
 * @typedef {import('./validator').Tester<V>} Tester
 */
/**
 * @template {SchemaValue} V
 * @typedef {import('./validator').Validator<V>} Validator
 */

exports.numeric = numeric;

/**
 * @typedef {Validator<number> & { type: 'number' | 'integer' }} NumericSubValidator
 */
/**
 * @typedef NumericProps
 * @property {'number' | 'integer'} type
 * @property {(from: number) => NumericSubValidator} min
 * @property {(to: number) => NumericSubValidator} max
 * @property {(from: number, to: number) => NumericSubValidator} range
 */
/**
 * @typedef {Validator<number> & NumericProps} NumericValidator
 */

/**
 * @param {Tester<SchemaValue>} test
 * @param {'number' | 'integer'} type
 * @returns {NumericValidator}
 */
function numeric(test, type) {
  const number = /** @type {NumericValidator} */ (validator(test, type));

  number.min = (min) =>
    makeValidator((v) => test(v) && v >= min, `${type} >= ${min}`, type);

  number.max = (max) =>
    makeValidator((v) => test(v) && v <= max, `${type} <= ${max}`, type);

  number.range = (min, max) =>
    makeValidator(
      (v) => test(v) && v >= min && v <= max,
      `${type} >= ${min} and <= ${max}`,
      type
    );

  number.type = type;

  return number;
}

/**
 * @param {Tester<number>} test
 * @param {string} toString
 * @param {'number' | 'integer'} type
 * @returns {NumericSubValidator}
 */
function makeValidator(test, toString, type) {
  const range = /** @type {NumericSubValidator} */ (validator(test, toString));
  range.type = type;
  return range;
}
