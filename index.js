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
const {
  copyPropertyDescriptor,
  copyTypeAndProperties,
  assertValidator
} = require('./lib/util');

/**
 * @typedef {import('./lib/verifyer').SchemaOptions} SchemaOptions
 * @typedef {import('./lib/verifyer').SchemaValue} SchemaValue
 * @typedef {import('./lib/verifyer').SchemaObjectValue} SchemaObjectValue
 * @typedef {import('./lib/object').ObjectProperties} ObjectProperties
 */
/**
 * @template {SchemaValue} V
 * @typedef {import('./lib/verifyer').SchemaReader<V>} SchemaReader
 */
/**
 * @template {SchemaValue} V
 * @typedef {import('./lib/verifyer').SchemaWriter<V>} SchemaWriter
 */
/**
 * @template {SchemaValue} V
 * @typedef {import('./lib/verifyer').SchemaRead<V>} SchemaRead
 */
/**
 * @template {SchemaValue} V
 * @typedef {import('./lib/verifyer').SchemaWrite<V>} SchemaWrite
 */
/**
 * @template {SchemaValue} V
 * @typedef {import('./lib/verifyer').RecursivePartial<V>} RecursivePartial
 */
/**
 * @template {ObjectProperties} P
 * @typedef {import('./lib/object').ObjectValidator<P>} ObjectValidator
 */
/**
 * @template {SchemaValue} V
 * @typedef {import('./lib/validator').Validator<V>} Validator
 */

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

/**
 * @template {SchemaValue} V
 * @typedef SchemaProps
 * @property {string} type
 * @property {(value: SchemaReader<V> | SchemaWriter<V>) => V} verify
 * @property {SchemaRead<V>} read
 * @property {SchemaWrite<V>} write
 */
/**
 * @template {SchemaValue} V
 * @callback SchemaFunc
 * @param {V} value
 * @param {SchemaOptions} [options]
 * @returns {V}
 */
/**
 * @template {SchemaValue} V
 * @typedef {SchemaFunc<V> & SchemaProps<V>} ValueSchema
 */
/**
 * @template {Validator<*>} V
 * @typedef {ValueSchema<Parameters<V>[0]> & V} Schema
 */

/**
 * @template {Validator<*>} V
 * @param {V} test
 * @param {SchemaOptions} [schema_options]
 * @returns {Schema<V>}
 */
function schema(test, schema_options = {}) {
  assertValidator(test);

  const schemaTest =
    'type' in test && test.type === 'Object'
      ? object(test['properties'], schema_options)
      : test;

  const verifyer = /** @type {Schema<V>} */ (
    createVerifyer(schemaTest, schema_options)
  );
  copyPropertyDescriptor(schemaTest.verify, 'read', verifyer);
  copyPropertyDescriptor(schemaTest.verify, 'write', verifyer);
  copyTypeAndProperties(schemaTest, verifyer);
  verifyer.verify = schemaTest.verify['verify'];
  return verifyer;
}

/**
 * @template {SchemaValue} V
 * @callback SchemaVerifyer
 * @param {V} value
 * @param {SchemaOptions} options
 */

/**
 * @template {SchemaValue} V
 * @param {Validator<V>} test
 * @param {SchemaOptions} schema_options
 * @returns {SchemaVerifyer<V>}
 */
function createVerifyer(test, schema_options) {
  return (value, options = schema_options) => test.verify(value, options);
}
