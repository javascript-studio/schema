'use strict';

const { validator } = require('./validator');

const string = validator(isString, 'string');

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

string.type = 'string';

exports.string = string;

function isString(v) {
  return typeof v === 'string';
}

function makeValidator(test, toString) {
  const range = validator(test, toString);
  range.type = 'string';
  return range;
}
