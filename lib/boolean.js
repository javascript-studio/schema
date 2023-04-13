'use strict';

const { validator } = require('./validator');

/**
 * @typedef {import('./validator').Validator<boolean>} BooleanValidator
 */
/**
 * @typedef BooleanProps
 * @property {'boolean'} type
 */

const boolean = /** @type {BooleanValidator & BooleanProps} */ (
  validator((v) => typeof v === 'boolean', 'boolean')
);
boolean.type = 'boolean';

exports.boolean = boolean;
