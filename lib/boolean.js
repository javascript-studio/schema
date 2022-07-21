'use strict';

const { validator } = require('./validator');

const boolean = validator((v) => typeof v === 'boolean', 'boolean');
boolean.type = 'boolean';

exports.boolean = boolean;
