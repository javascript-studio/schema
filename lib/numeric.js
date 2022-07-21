'use strict';

const { validator } = require('./validator');

exports.numeric = function (test, type) {
  const number = validator(test, type);

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
};

function makeValidator(test, toString, type) {
  const range = validator(test, toString);
  range.type = type;
  return range;
}
