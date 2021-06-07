'use strict';

const { SCHEMA_VALIDATION } = require('./lib/constants');
const { defined } = require('./lib/defined');
const { boolean } = require('./lib/boolean');
const { number } = require('./lib/number');
const { integer } = require('./lib/integer');
const { string } = require('./lib/string');
const { literal } = require('./lib/literal');
const { opt } = require('./lib/opt');
const { one } = require('./lib/one');
const { object } = require('./lib/object');
const { array } = require('./lib/array');
const { map } = require('./lib/map');
const { validator } = require('./lib/validator');
const { schema } = require('./lib/schema');

schema.schema = schema;

schema.defined = defined;

schema.boolean = boolean;

schema.number = number;

schema.integer = integer;

schema.string = string;

schema.literal = literal;

schema.opt = opt;

schema.one = one;

schema.object = object;

schema.array = array;

schema.map = map;

schema.validator = validator;

schema.SCHEMA_VALIDATION = SCHEMA_VALIDATION;

module.exports = schema;
