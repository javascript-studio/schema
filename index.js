'use strict';

const { SCHEMA_VALIDATION } = require('./lib/constants');
const { opt } = require('./lib/opt');
const { one } = require('./lib/one');
const { object } = require('./lib/object');
const { array } = require('./lib/array');
const { map } = require('./lib/map');
const { schema } = require('./lib/schema');

schema.schema = schema;

schema.opt = opt;

schema.one = one;

schema.object = object;

schema.array = array;

schema.map = map;

schema.SCHEMA_VALIDATION = SCHEMA_VALIDATION;

module.exports = schema;
