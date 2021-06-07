'use strict';

const {
  arrayPath,
  raw,
  unwrap,
  assertType,
  lazy,
  specName
} = require('./util');
const { stringify } = require('./stringify');
const { failSet, failDelete, failSchemaValidation } = require('./fail');
const { createItemGetter } = require('./create-item-getter');

exports.arrayVerifyer = arrayVerifyer;

function arrayVerifyer(itemTest, item_spec) {
  const verify = (value, property) => {
    assertType(value, 'Array', property);
    value.forEach((element, index) =>
      itemTest.verify(element, arrayPath(property, index))
    );
    return value;
  };
  verify.raw = raw;
  lazy(verify, 'read', () => createArrayItemReader(itemTest, verify));
  lazy(verify, 'write', () => createArrayItemWriter(itemTest, item_spec));
  return verify;
}

function createArrayItemReader(itemTest, verify) {
  return (array, emitter, base) => {
    return new Proxy(verify(unwrap(array)), {
      get: createItemGetter(itemTest, emitter, base, 'read'),
      set: failSet,
      deleteProperty: failDelete
    });
  };
}

function createArrayItemWriter(itemTest, item_spec) {
  return (array, emitter, base) => {
    array = unwrap(array);
    if (emitter) {
      emitArrayEvents(array, emitter, base, itemTest, item_spec);
    }
    return new Proxy(array, {
      get: createItemGetter(itemTest, emitter, base, 'write'),
      set(target, key, value) {
        if (typeof key === 'string' && key !== 'length') {
          value = unwrap(value);
          const index = getArrayIndex(key, base);
          const path = arrayPath(base, index);
          itemTest.verify(value, path);
          if (emitter) {
            emitter.emit('set', {
              type: 'array',
              array,
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
            array,
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
    verifyArrayMethodValues(base, 'push', 0, values, itemTest, item_spec);
    emitter.emit('push', { array, base, values });
    return Array.prototype.push.call(array, ...values);
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
    verifyArrayMethodValues(base, 'unshift', 0, values, itemTest, item_spec);
    emitter.emit('unshift', { array, base, values });
    return Array.prototype.unshift.call(array, ...values);
  };
  proto.splice = (start, delete_count, ...values) => {
    verifyArrayMethodValues(base, 'splice', 2, values, itemTest, item_spec);
    emitter.emit('splice', { array, base, start, delete_count, values });
    return Array.prototype.splice.call(array, start, delete_count, ...values);
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
          } of ${base}.${method} to be ${specName(
            item_spec
          )} but got ${stringify(value)}`
        )
      );
    }
  });
}
