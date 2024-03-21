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

/**
 * @typedef {Validator<string> & { type: 'string' }} VStringSub
 */
/**
 * @typedef VStringLengthProps
 * @property {(from: number) => VStringSub} min
 * @property {(to: number) => VStringSub} max
 * @property {(from: number, to: number) => VStringSub} range
 */
/**
 * @typedef VStringProps
 * @property {'string'} type
 * @property {VStringLengthProps} length
 * @property {(re: RegExp) => VStringSub} regexp
 */
/**
 * @typedef {Validator<string> & VStringProps} VString
 */

const string = /** @type {VString} */ (makeValidator(isString, 'string'));

Object.defineProperty(string, 'length', {
  value: {
    min: (min) =>
      makeValidator(
        (v) => isString(v) && v.length >= min,
        `string with length >= ${min}`
      ),

    max: (max) =>
      makeValidator(
        (v) => isString(v) && v.length <= max,
        `string with length <= ${max}`
      ),

    range: (min, max) =>
      makeValidator(
        (v) => isString(v) && v.length >= min && v.length <= max,
        `string with length >= ${min} and <= ${max}`
      )
  }
});

Object.defineProperty(string, 'regexp', {
  value: (regexp) =>
    makeValidator(
      (value) => isString(value) && regexp.test(value),
      `string matching ${regexp}`
    )
});

exports.string = string;

/**
 * @param {Value} v
 * @returns {boolean}
 */
function isString(v) {
  return typeof v === 'string';
}

/**
 * @param {Tester<string>} test
 * @param {string} toString
 * @returns {VStringSub}
 */
function makeValidator(test, toString) {
  const range = /** @type {VStringSub} */ (validator(test, toString));
  range.type = 'string';
  return range;
}
