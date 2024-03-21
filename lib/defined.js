'use strict';

const { validator } = require('./validator');

/**
 * @typedef {import('./verifyer').Value} Value
 * @typedef {import('./validator').Validator<NonNullable<Value> | null>} VDefined
 */

exports.defined = /** @type {VDefined} */ (
  validator((v) => typeof v !== 'undefined', 'defined')
);
