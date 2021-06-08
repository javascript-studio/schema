'use strict';

const { numeric } = require('./numeric');

exports.number = numeric(isNumber, 'number');

function isNumber(v) {
  return typeof v === 'number' && isFinite(v);
}
