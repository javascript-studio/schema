'use strict';

const {
  arrayPath,
  unwrap,
  assertType,
  lazy,
  failSet,
  failDelete,
  failSchemaValidation
} = require('./util');
const { createItemGetter } = require('./create-item-getter');

/**
 * @typedef {import('./verifyer').Value} Value
 */
/**
 * @template {Value} V
 * @typedef {import('./verifyer').Verifyer<V>} Verifyer
 */
/**
 * @template {Value} V
 * @typedef {import('./validator').Validator<V>} Validator
 */

exports.arrayVerifyer = arrayVerifyer;

/**
 * @template {Value} V
 * @param {Validator<V>} itemTest
 * @returns {Verifyer<Array<V>>}
 */
function arrayVerifyer(itemTest) {
  const verify = createVerify(itemTest);
  lazy(verify, 'read', () => createArrayItemReader(itemTest, verify));
  lazy(verify, 'write', () => createArrayItemWriter(itemTest));
  return verify;
}

/**
 * @template {Value} V
 * @param {Validator<V>} itemTest
 * @returns {Verifyer<Array<V>>}
 */
function createVerify(itemTest) {
  return (value, options = {}, base = undefined) => {
    assertType(value, 'Array', base, options.error_code);
    value.forEach((element, index) =>
      itemTest.verify(element, options, arrayPath(base, index))
    );
    return value;
  };
}

/**
 * @template {Value} V
 * @param {Validator<V>} itemTest
 * @param {Verifyer<Array<V>>} verify
 * @returns {Verifyer<Array<V>>}
 */
function createArrayItemReader(itemTest, verify) {
  return (array, options = {}, base = undefined) => {
    return new Proxy(verify(unwrap(array), options), {
      get: createItemGetter(itemTest, options, base, 'read', arrayPath),
      set: failSet,
      deleteProperty: failDelete
    });
  };
}

function createArrayItemWriter(itemTest) {
  return (array, options = {}, base = undefined) => {
    array = unwrap(array);
    return new Proxy(array, {
      get: createItemGetter(itemTest, options, base, 'write', arrayPath),
      set(target, key, value) {
        if (typeof key === 'string' && key !== 'length') {
          value = unwrap(value);
          const index = getArrayIndex(key, base);
          const path = arrayPath(base, index);
          itemTest.verify(value, {}, path);
        }
        return Reflect.set(target, key, value);
      },
      deleteProperty(target, key) {
        return Reflect.deleteProperty(target, key);
      }
    });
  };
}

/**
 * @param {string} key
 * @param {string | undefined} base
 * @returns {number}
 */
function getArrayIndex(key, base) {
  const index = parseInt(key, 10);
  if (String(index) !== key || index < 0) {
    failSchemaValidation(
      new TypeError(
        `Expected property "${arrayPath(base, key)}" to be a valid array index`
      )
    );
  }
  return index;
}
