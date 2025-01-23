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
 * @typedef {import('./lib/verifyer').Value} Value
 * @typedef {import('./lib/verifyer').ObjectValue} ObjectValue
 * @typedef {import('./lib/object').ObjectProperties} ObjectProperties
 */
/**
 * @template {ObjectProperties} P
 * @typedef {import('./lib/object').VObject<P>} VObject
 */
/**
 * @template {Value} V
 * @typedef {import('./lib/validator').Validator<V>} Validator
 */
/**
 * @template {Validator<*>} V
 * @typedef {import('./lib/validator').VParameter<V>} VParameter
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
 * @template {Value} V
 * @typedef WithToJSON
 * @property {() => V} toJSON
 */
/**
 * @template {Value} V
 * @typedef {V & WithToJSON<V>} SchemaReader
 */
/**
 * @template {Value} V
 * @typedef {V & WithToJSON<V>} SchemaWriter
 */
/**
 * @template {Value} V
 * @callback SchemaRead
 * @param {V} value
 * @param {SchemaOptions} [options]
 * @returns {SchemaReader<V>}
 */
/* eslint-disable jsdoc/valid-types */
/**
 * @template {Value} V
 * @typedef {V extends ObjectValue ? { [K in keyof V]?: RecursivePartial<V[K]> } : V} RecursivePartial
 */
/* eslint-enable */
/**
 * @template {Value} V
 * @callback SchemaWrite
 * @param {RecursivePartial<V>} value
 * @param {SchemaOptions} [options]
 * @returns {SchemaWriter<V>}
 */

/**
 * @template {Value} V
 * @typedef SchemaProps
 * @property {string} type
 * @property {(value: SchemaReader<V> | SchemaWriter<V>) => V} verify
 * @property {SchemaRead<V>} read
 * @property {SchemaWrite<V>} write
 */
/**
 * @template {Value} V
 * @callback SchemaFunc
 * @param {V} value
 * @param {SchemaOptions} [options]
 * @returns {V}
 */
/**
 * @template {Value} V
 * @typedef {SchemaFunc<V> & SchemaProps<V>} ValueSchema
 */
/**
 * @template {Validator<*>} V
 * @typedef {ValueSchema<VParameter<V>> & V} Schema
 */

/* eslint-disable jsdoc/valid-types */
/**
 * @template I
 * @typedef {I extends Validator<infer V> ? V : I extends Schema<infer V> ? V : never} Infer
 */
/** eslint-enable jsdoc/valid-types */

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

  const verifyer = /** @type {Schema<*>} */ (
    createVerifyer(schemaTest, schema_options)
  );
  copyPropertyDescriptor(schemaTest.verify, 'read', verifyer);
  copyPropertyDescriptor(schemaTest.verify, 'write', verifyer);
  copyTypeAndProperties(schemaTest, verifyer);
  verifyer.verify = schemaTest.verify['verify'];
  return verifyer;
}

/**
 * @template {Value} V
 * @callback SchemaVerifyer
 * @param {V} value
 * @param {SchemaOptions} options
 */

/**
 * @template {Value} V
 * @param {Validator<V>} test
 * @param {SchemaOptions} schema_options
 * @returns {SchemaVerifyer<V>}
 */
function createVerifyer(test, schema_options) {
  return (value, options = schema_options) => test.verify(value, options);
}
