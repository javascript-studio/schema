'use strict';

const {
  arrayPath,
  unwrap,
  assertType,
  lazy,
  stringify,
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
    const { emitter } = options;
    if (emitter) {
      emitArrayEvents(array, emitter, base, itemTest);
    }
    return new Proxy(array, {
      get: createItemGetter(itemTest, options, base, 'write', arrayPath),
      set(target, key, value) {
        if (typeof key === 'string' && key !== 'length') {
          value = unwrap(value);
          const index = getArrayIndex(key, base);
          const path = arrayPath(base, index);
          itemTest.verify(value, {}, path);
          if (emitter) {
            emitter.emit('set', {
              type: 'array',
              array: target,
              base,
              index,
              path,
              value
            });
          }
        }
        return Reflect.set(target, key, value);
      },
      deleteProperty(target, key) {
        if (emitter) {
          const index = getArrayIndex(/** @type {string} */ (key), base);
          const path = arrayPath(base, index);
          emitter.emit('delete', {
            type: 'array',
            array: target,
            base,
            index,
            path
          });
        }
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

/**
 * @template {Value} V
 * @param {Array<V>} array
 * @param {Object} emitter
 * @param {string | undefined} base
 * @param {Validator<V>} itemTest
 */
function emitArrayEvents(array, emitter, base, itemTest) {
  const proto = Object.create(Array.prototype);
  /**
   * @param {V[]} values
   * @returns {number}
   */
  proto.push = (...values) => {
    const unwrapped = values.map(unwrap);
    verifyArrayMethodValues(base, 'push', 0, unwrapped, itemTest);
    emitter.emit('push', { array, base, values: unwrapped });
    return Array.prototype.push.call(array, ...unwrapped);
  };
  /**
   * @returns {V}
   */
  proto.pop = () => {
    emitter.emit('pop', { array, base });
    return Array.prototype.pop.call(array);
  };
  /**
   * @returns {V}
   */
  proto.shift = () => {
    emitter.emit('shift', { array, base });
    return Array.prototype.shift.call(array);
  };
  /**
   * @param {V[]} values
   * @returns {number}
   */
  proto.unshift = (...values) => {
    const unwrapped = values.map(unwrap);
    verifyArrayMethodValues(base, 'unshift', 0, unwrapped, itemTest);
    emitter.emit('unshift', { array, base, values: unwrapped });
    return Array.prototype.unshift.call(array, ...unwrapped);
  };
  /**
   * @param {number} start
   * @param {number} delete_count
   * @param {V[]} values
   * @returns {V[]}
   */
  proto.splice = (start, delete_count, ...values) => {
    const unwrapped = values.map(unwrap);
    verifyArrayMethodValues(base, 'splice', 2, unwrapped, itemTest);
    emitter.emit('splice', {
      array,
      base,
      start,
      delete_count,
      values: unwrapped
    });
    return Array.prototype.splice.call(
      array,
      start,
      delete_count,
      ...unwrapped
    );
  };
  Object.setPrototypeOf(array, proto);
}

/**
 * @template {Value} V
 * @param {string | undefined} base
 * @param {string} method
 * @param {number} offset
 * @param {Array<V>} values
 * @param {Validator<V>} itemTest
 */
function verifyArrayMethodValues(base, method, offset, values, itemTest) {
  values.forEach((value, i) => {
    if (itemTest(value) === false) {
      failSchemaValidation(
        new TypeError(
          `Expected argument ${
            i + offset + 1
          } of ${base}.${method} to be ${itemTest} but got ${stringify(value)}`
        )
      );
    }
  });
}
