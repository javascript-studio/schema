'use strict';

const { validator } = require('./validator');

exports.number = validator(
  (v) => typeof v === 'number' && isFinite(v),
  'number'
);
