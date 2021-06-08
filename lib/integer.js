'use strict';

const { numeric } = require('./numeric');

exports.integer = numeric(isInteger, 'integer');

function isInteger(v) {
  return typeof v === 'number' && isFinite(v) && Math.floor(v) === v;
}
