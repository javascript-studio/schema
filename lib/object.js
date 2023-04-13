'use strict';

const { assertType, typeOf, assertValidator } = require('./util');
const { objectVerifyer } = require('./object-verifyer');
const { validator } = require('./validator');

/**
 * @typedef {import('./verifyer').SchemaValue} SchemaValue
 * @typedef {import('./verifyer').SchemaObjectValue} SchemaObjectValue
 * @typedef {import('./verifyer').SchemaOptions} SchemaOptions
 * @typedef {import('./opt').OptValidator<*>} OptValidator
 */
/**
 * @template {SchemaValue} V
 * @typedef {import('./verifyer').Tester<V>} Tester
 */
/**
 * @template {SchemaValue} V
 * @typedef {import('./validator').Validator<V>} Validator
 */

exports.object = object;

/* eslint-disable jsdoc/valid-types */
/**
 * @template {SchemaObjectValue} O
 * @typedef {{ [K in keyof O]: undefined extends O[K] ? K : never}[keyof O] } OptionalKeys
 */
/* eslint-enable */
/**
 * @template {SchemaObjectValue} O
 * @typedef {Partial<Pick<O, OptionalKeys<O>>> & Omit<O, OptionalKeys<O>>} ObjectValue
 */
/**
 * @typedef {Record<string, Validator<*>>} ObjectProperties
 */
/**
 * @template {ObjectProperties} P
 * @typedef {{ [K in keyof P]: Parameters<P[K]>[0] }} ObjectParameters
 */
/**
 * @template {ObjectProperties} P
 * @typedef {ObjectValue<ObjectParameters<P>>} ObjectValueForProperties
 */
/**
 * @template {ObjectProperties} P
 * @typedef ObjectProps
 * @property {'Object'} type
 * @property {P} properties
 */
/**
 * @template {ObjectProperties} P
 * @typedef {Validator<ObjectValueForProperties<P>> & ObjectProps<P>} ObjectValidator
 */

/**
 * @template {ObjectProperties} P
 * @param {P} properties
 * @param {SchemaOptions} [schema_options]
 * @returns {ObjectValidator<P>}
 */
function object(properties, schema_options) {
  assertProperties(properties);

  const test = /** @type {ObjectValidator<P>} */ (
    validator(
      objectTester(properties),
      objectValidatorName(properties),
      objectVerifyer(properties, schema_options)
    )
  );
  test.type = 'Object';
  test.properties = properties;
  return test;
}

object.any = /** @type {Validator<SchemaObjectValue>} */ (
  validator(isObject, 'object')
);

/**
 * @param {SchemaValue} value
 * @returns {boolean}
 */
function isObject(value) {
  return typeOf(value) === 'Object';
}

/**
 * @template {ObjectProperties} P
 * @param {P} properties
 * @returns {Tester<ObjectValueForProperties<P>>}
 */
function objectTester(properties) {
  return (value) =>
    isObject(value) &&
    Object.keys(properties).every((key) => properties[key](value[key], key)) &&
    Object.keys(value).every((key) => Boolean(properties[key]));
}

/**
 * @template {ObjectProperties} P
 * @param {P} properties
 * @returns {() => string}
 */
function objectValidatorName(properties) {
  return () => {
    const p = Object.keys(properties).map((key) => `${key}:${properties[key]}`);
    return `{${p.join(', ')}}`;
  };
}

/**
 * @template {ObjectProperties} P
 * @param {P} properties
 */
function assertProperties(properties) {
  assertType(properties, 'Object');
  for (const valueTest of Object.values(properties)) {
    assertValidator(valueTest);
  }
}
