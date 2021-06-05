'use strict';

const { validator } = require('./validator');

exports.integer = validator(
  (v) => typeof v === 'number' && isFinite(v) && Math.floor(v) === v,
  'integer'
);
