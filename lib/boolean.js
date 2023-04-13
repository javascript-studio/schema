'use strict';

const { validator } = require('./validator');

/**
 * @typedef {import('./validator').Validator<boolean>} BooleanValidator
 */

const boolean = /** @type {BooleanValidator & { type: 'boolean' }} */ (
  validator((v) => typeof v === 'boolean', 'boolean')
);
boolean.type = 'boolean';

exports.boolean = boolean;
