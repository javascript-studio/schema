'use strict';

const { validator } = require('./validator');

exports.numeric = function (test, name) {
  const number = validator(test, name);

  number.min = (min) =>
    validator((v) => test(v) && v >= min, `${name} >= ${min}`);

  number.max = (max) =>
    validator((v) => test(v) && v <= max, `${name} <= ${max}`);

  number.range = (min, max) =>
    validator(
      (v) => test(v) && v >= min && v <= max,
      `${name} >= ${min} and <= ${max}`
    );

  return number;
};
