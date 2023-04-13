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

/**
 * @typedef {Validator<string> & { type: 'string' }} StringSubValidator
 */
/**
 * @typedef StringLengthProps
 * @property {(from: number) => StringSubValidator} min
 * @property {(to: number) => StringSubValidator} max
 * @property {(from: number, to: number) => StringSubValidator} range
 */
/**
 * @typedef StringProps
 * @property {'string'} type
 * @property {StringLengthProps} length
 * @property {(re: RegExp) => StringSubValidator} regexp
 */
/**
 * @typedef {Validator<string> & StringProps} StringValidator
 */

const string = /** @type {StringValidator} */ (
  makeValidator(isString, 'string')
);

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
 * @param {SchemaValue} v
 * @returns {boolean}
 */
function isString(v) {
  return typeof v === 'string';
}

/**
 * @param {Tester<string>} test
 * @param {string} toString
 * @returns {StringSubValidator}
 */
function makeValidator(test, toString) {
  const range = /** @type {StringSubValidator} */ (validator(test, toString));
  range.type = 'string';
  return range;
}
