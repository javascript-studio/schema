'use strict';

const { numeric } = require('./numeric');

/**
 * @typedef {import('./verifyer').SchemaValue} SchemaValue
 */

exports.integer = numeric(isInteger, 'integer');

/**
 * @param {SchemaValue} v
 * @returns {boolean}
 */
function isInteger(v) {
  return typeof v === 'number' && isFinite(v) && Math.floor(v) === v;
}
