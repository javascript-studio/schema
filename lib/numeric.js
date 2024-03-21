'use strict';

const { validator } = require('./validator');

/**
 * @typedef {import('./verifyer').Value} Value
 */
/**
 * @template {Value} V
 * @typedef {import('./validator').Tester<V>} Tester
 */
/**
 * @template {Value} V
 * @typedef {import('./validator').Validator<V>} Validator
 */

exports.numeric = numeric;

/**
 * @typedef {Validator<number> & { type: 'number' | 'integer' }} VNumericSub
 */
/**
 * @typedef VNumericProps
 * @property {'number' | 'integer'} type
 * @property {(from: number) => VNumericSub} min
 * @property {(to: number) => VNumericSub} max
 * @property {(from: number, to: number) => VNumericSub} range
 */
/**
 * @typedef {Validator<number> & VNumericProps} VNumeric
 */

/**
 * @param {Tester<Value>} test
 * @param {'number' | 'integer'} type
 * @returns {VNumeric}
 */
function numeric(test, type) {
  const number = /** @type {VNumeric} */ (validator(test, type));

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
 * @returns {VNumericSub}
 */
function makeValidator(test, toString, type) {
  const range = /** @type {VNumericSub} */ (validator(test, toString));
  range.type = type;
  return range;
}
