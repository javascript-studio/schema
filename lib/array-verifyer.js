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

exports.arrayVerifyer = arrayVerifyer;

function arrayVerifyer(itemTest, item_spec) {
  const verify = createVerify(itemTest);
  lazy(verify, 'read', () => createArrayItemReader(itemTest, verify));
  lazy(verify, 'write', () => createArrayItemWriter(itemTest, item_spec));
  return verify;
}

function createVerify(itemTest) {
  return (value, options = {}, base = undefined) => {
    assertType(value, 'Array', base, options.error_code);
    value.forEach((element, index) =>
      itemTest.verify(element, options, arrayPath(base, index))
    );
    return value;
  };
}

function createArrayItemReader(itemTest, verify) {
  return (array, options = {}, base = undefined) => {
    return new Proxy(verify(unwrap(array), options), {
      get: createItemGetter(itemTest, options, base, 'read', arrayPath),
      set: failSet,
      deleteProperty: failDelete
    });
  };
}

function createArrayItemWriter(itemTest, item_spec) {
  return (array, options = {}, base = undefined) => {
    array = unwrap(array);
    const { emitter } = options;
    if (emitter) {
      emitArrayEvents(array, emitter, base, itemTest, item_spec);
    }
    return new Proxy(array, {
      get: createItemGetter(itemTest, options, base, 'write', arrayPath),
      set(target, key, value) {
        if (typeof key === 'string' && key !== 'length') {
          value = unwrap(value);
          const index = getArrayIndex(key, base);
          const path = arrayPath(base, index);
          itemTest.verify(value, options, path);
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
          const index = getArrayIndex(key, base);
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

function emitArrayEvents(array, emitter, base, itemTest, item_spec) {
  const proto = Object.create(Array.prototype);
  proto.push = (...values) => {
    const unwrapped = values.map(unwrap);
    verifyArrayMethodValues(base, 'push', 0, unwrapped, itemTest, item_spec);
    emitter.emit('push', { array, base, values: unwrapped });
    return Array.prototype.push.call(array, ...unwrapped);
  };
  proto.pop = () => {
    emitter.emit('pop', { array, base });
    return Array.prototype.pop.call(array);
  };
  proto.shift = () => {
    emitter.emit('shift', { array, base });
    return Array.prototype.shift.call(array);
  };
  proto.unshift = (...values) => {
    const unwrapped = values.map(unwrap);
    verifyArrayMethodValues(base, 'unshift', 0, unwrapped, itemTest, item_spec);
    emitter.emit('unshift', { array, base, values: unwrapped });
    return Array.prototype.unshift.call(array, ...unwrapped);
  };
  proto.splice = (start, delete_count, ...values) => {
    const unwrapped = values.map(unwrap);
    verifyArrayMethodValues(base, 'splice', 2, unwrapped, itemTest, item_spec);
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

function verifyArrayMethodValues(
  base,
  method,
  offset,
  values,
  itemTest,
  item_spec
) {
  values.forEach((value, i) => {
    if (itemTest(value) === false) {
      failSchemaValidation(
        new TypeError(
          `Expected argument ${
            i + offset + 1
          } of ${base}.${method} to be ${item_spec} but got ${stringify(value)}`
        )
      );
    }
  });
}
