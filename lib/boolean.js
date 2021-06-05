'use strict';

const { validator } = require('./validator');

exports.boolean = validator((v) => typeof v === 'boolean', 'boolean');
