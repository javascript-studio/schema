'use strict';

const { validator } = require('./validator');

const number = validator(isNumber, 'number');

number.min = (min) =>
  validator((v) => isNumber(v) && v >= min, `number >= ${min}`);

number.max = (max) =>
  validator((v) => isNumber(v) && v <= max, `number <= ${max}`);

number.range = (min, max) =>
  validator(
    (v) => isNumber(v) && v >= min && v <= max,
    `number >= ${min} and <= ${max}`
  );

exports.number = number;

function isNumber(v) {
  return typeof v === 'number' && isFinite(v);
}
