'use strict';

const { validator } = require('./validator');

exports.string = validator((v) => typeof v === 'string', 'string');
