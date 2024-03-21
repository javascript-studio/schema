'use strict';

const { numeric } = require('./numeric');

/**
 * @typedef {import('./verifyer').Value} Value
 */

exports.number = numeric(isNumber, 'number');

/**
 * @param {Value} v
 * @returns {boolean}
 */
function isNumber(v) {
  return typeof v === 'number' && isFinite(v);
}
