'use strict';

const {
  objectPath,
  unwrap,
  assertType,
  lazy,
  failSet,
  failDelete
} = require('./util');
const { createItemGetter } = require('./create-item-getter');

/**
 * @typedef {import('./verifyer').SchemaValue} SchemaValue
 */
/**
 * @template {SchemaValue} V
 * @typedef {import('./verifyer').Verifyer<V>} Verifyer
 */
/**
 * @template {SchemaValue} V
 * @typedef {import('./validator').Validator<V>} Validator
 */

exports.mapVerifyer = mapVerifyer;

/**
 * @template {Verifyer<string | number>} K
 * @template {Validator<*>} V
 * @param {K} keyVerify
 * @param {V} valueTest
 * @returns {Verifyer<Record<string | number, Parameters<V>[0]>>}
 */
function mapVerifyer(keyVerify, valueTest) {
  const verify = createVerify(keyVerify, valueTest);
  lazy(verify, 'read', () => createMapValueReader(valueTest, verify));
  lazy(verify, 'write', () => createMapValueWriter(valueTest));
  return verify;
}

/**
 * @template {Verifyer<string | number>} K
 * @template {Validator<*>} V
 * @param {K} keyVerify
 * @param {V} valueTest
 * @returns {Verifyer<Record<string | number, Parameters<V>[0]>>}
 */
function createVerify(keyVerify, valueTest) {
  return (value, options = {}, base = undefined) => {
    assertType(value, 'Object', base, options.error_code);
    for (const [key, item] of Object.entries(value)) {
      const ref = objectPath(base, key);
      keyVerify(key, options, ref);
      valueTest.verify(item, options, ref);
    }
    return value;
  };
}

function createMapValueReader(valueTest, verify) {
  return (map, options, base) => {
    return new Proxy(verify(unwrap(map), options), {
      get: createItemGetter(valueTest, options, base, 'read', objectPath),
      set: failSet,
      deleteProperty: failDelete
    });
  };
}

function createMapValueWriter(valueTest) {
  return (map, options, base) => {
    return new Proxy(unwrap(map), {
      get: createItemGetter(valueTest, options, base, 'write', objectPath),
      set: createItemSetter(valueTest, options, base),
      deleteProperty(target, key) {
        if (options && options.emitter && typeof key === 'string') {
          const path = objectPath(base, key);
          options.emitter.emit('delete', {
            type: 'object',
            object: target,
            key,
            base,
            path
          });
        }
        return Reflect.deleteProperty(target, key);
      }
    });
  };
}

function createItemSetter(valueTest, options, base) {
  return (target, key, value) => {
    if (typeof key === 'string') {
      value = unwrap(value);
      const path = objectPath(base, key);
      valueTest.verify(value, options, path);
      if (options && options.emitter) {
        options.emitter.emit('set', {
          type: 'object',
          object: target,
          key,
          value,
          base,
          path
        });
      }
    }
    return Reflect.set(target, key, value);
  };
}
