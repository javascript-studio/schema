'use strict';

const { numeric } = require('./numeric');

/**
 * @typedef {import('./verifyer').Value} Value
 */

exports.integer = numeric(isInteger, 'integer');

/**
 * @param {Value} v
 * @returns {boolean}
 */
function isInteger(v) {
  return typeof v === 'number' && isFinite(v) && Math.floor(v) === v;
}
