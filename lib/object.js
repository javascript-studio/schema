'use strict';

const { assertType, typeOf, assertValidator } = require('./util');
const { objectVerifyer } = require('./object-verifyer');
const { validator } = require('./validator');

/**
 * @typedef {import('./verifyer').Value} Value
 * @typedef {import('./verifyer').ObjectValue} ObjectValue
 * @typedef {import('./verifyer').SchemaOptions} SchemaOptions
 */
/**
 * @template {Value} V
 * @typedef {import('./verifyer').Tester<V>} Tester
 */
/**
 * @template {Value} V
 * @typedef {import('./validator').Validator<V>} Validator
 */
/**
 * @template {Validator<*>} V
 * @typedef {import('./validator').VParameter<V>} VParameter
 */

exports.object = object;

/* eslint-disable jsdoc/valid-types */
/**
 * @template {ObjectValue} O
 * @typedef {{ [K in keyof O]: undefined extends O[K] ? K : never}[keyof O] } OptionalKeys
 */
/* eslint-enable */
/**
 * @template {ObjectValue} O
 * @typedef {Partial<Pick<O, OptionalKeys<O>>> & Omit<O, OptionalKeys<O>>} ObjectType
 */
/**
 * @typedef {Record<string, Validator<*>>} ObjectProperties
 */
/**
 * @template {ObjectProperties} P
 * @typedef {{ [K in keyof P]: VParameter<P[K]> }} ObjectParameters
 */
/**
 * @template {ObjectProperties} P
 * @typedef {ObjectType<ObjectParameters<P>>} VProps
 */
/**
 * @template {ObjectProperties} P
 * @typedef {Validator<VProps<P>> & { type: 'Object', properties: P }} VObject
 */

/**
 * @template {ObjectProperties} P
 * @param {P} properties
 * @param {SchemaOptions} [schema_options]
 * @returns {VObject<P>}
 */
function object(properties, schema_options) {
  assertProperties(properties);

  const test = /** @type {VObject<P>} */ (
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

object.any = /** @type {Validator<ObjectValue>} */ (
  validator(isObject, 'object')
);

/**
 * @param {Value} value
 * @returns {boolean}
 */
function isObject(value) {
  return typeOf(value) === 'Object';
}

/**
 * @template {ObjectProperties} P
 * @param {P} properties
 * @returns {Tester<VProps<P>>}
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
