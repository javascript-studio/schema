'use strict';

const { validator } = require('./validator');

/**
 * @typedef {import('./validator').Validator<boolean> & { type: 'boolean' }} VBoolean
 */

const boolean = /** @type {VBoolean} */ (
  validator((v) => typeof v === 'boolean', 'boolean')
);
boolean.type = 'boolean';

exports.boolean = boolean;
