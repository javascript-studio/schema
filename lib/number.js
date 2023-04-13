'use strict';

const { numeric } = require('./numeric');

/**
 * @typedef {import('./verifyer').SchemaValue} SchemaValue
 */

exports.number = numeric(isNumber, 'number');

/**
 * @param {SchemaValue} v
 * @returns {boolean}
 */
function isNumber(v) {
  return typeof v === 'number' && isFinite(v);
}
