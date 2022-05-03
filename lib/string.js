'use strict';

const { validator } = require('./validator');

const string = validator(isString, 'string');

Object.defineProperty(string, 'length', {
  value: {
    min: (min) =>
      validator(
        (v) => isString(v) && v.length >= min,
        `string with length >= ${min}`
      ),

    max: (max) =>
      validator(
        (v) => isString(v) && v.length <= max,
        `string with length <= ${max}`
      ),

    range: (min, max) =>
      validator(
        (v) => isString(v) && v.length >= min && v.length <= max,
        `string with length >= ${min} and <= ${max}`
      )
  }
});

Object.defineProperty(string, 'regexp', {
  value: (regexp) =>
    validator(
      (value) => isString(value) && regexp.test(value),
      `string matching ${regexp}`
    )
});

exports.string = string;

function isString(v) {
  return typeof v === 'string';
}
