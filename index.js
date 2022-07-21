'use strict';

const { E_SCHEMA } = require('./lib/constants');
const { defined } = require('./lib/defined');
const { boolean } = require('./lib/boolean');
const { number } = require('./lib/number');
const { integer } = require('./lib/integer');
const { string } = require('./lib/string');
const { literal } = require('./lib/literal');
const { opt } = require('./lib/opt');
const { one } = require('./lib/one');
const { all } = require('./lib/all');
const { object } = require('./lib/object');
const { array } = require('./lib/array');
const { map } = require('./lib/map');
const { validator } = require('./lib/validator');
const { lookup } = require('./lib/registry');
const { copyPropertyDescriptor, copyTypeAndProperties } = require('./lib/util');

function schema(spec, spec_options = {}) {
  const test = lookup(spec, spec_options);
  /** @type {Object} */
  const verifyer = createVerifyer(test, spec_options);
  copyPropertyDescriptor(test.verify, 'read', verifyer);
  copyPropertyDescriptor(test.verify, 'write', verifyer);
  copyTypeAndProperties(test, verifyer);
  verifyer.verify = test.verify.verify;
  return verifyer;
}

function createVerifyer(test, spec_options) {
  return (value, options = spec_options) => test.verify(value, options);
}

module.exports = schema;

module.exports.schema = schema;

module.exports.defined = defined;

module.exports.boolean = boolean;

module.exports.number = number;

module.exports.integer = integer;

module.exports.string = string;

module.exports.literal = literal;

module.exports.opt = opt;

module.exports.one = one;

module.exports.all = all;

module.exports.object = object;

module.exports.array = array;

module.exports.map = map;

module.exports.validator = validator;

module.exports.E_SCHEMA = E_SCHEMA;
