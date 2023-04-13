'use strict';

const { validator } = require('./validator');

/**
 * @typedef {import('./verifyer').SchemaValue} SchemaValue
 * @typedef {import('./validator').Validator<NonNullable<SchemaValue> | null>} DefinedValidator
 */

exports.defined = /** @type {DefinedValidator} */ (
  validator((v) => typeof v !== 'undefined', 'defined')
);
