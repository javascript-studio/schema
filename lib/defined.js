'use strict';

const { validator } = require('./validator');

exports.defined = validator((v) => typeof v !== 'undefined', 'defined');
