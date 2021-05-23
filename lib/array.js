'use strict';

const { RAW_SYMBOL } = require('./constants');
const { lazy } = require('./lazy');
const { arrayPath } = require('./path');
const { type } = require('./type');
const { stringify } = require('./stringify');
const { specName } = require('./spec-name');
const { specTest } = require('./spec-test');
const { failSet, failDelete, failSchemaValidation } = require('./fail');
const { createItemGetter } = require('./create-item-getter');

exports.array = array;

function array(spec) {
  const itemTest = spec.verify ? spec : specTest(spec);
  const arrayTest = value => type.array(value) && value.every(itemTest);
  arrayTest.verify = arrayVerifyer(itemTest, spec);
  return lazy(arrayTest, 'specName', () => `array(${specName(spec)})`);
}

function arrayVerifyer(itemTest, item_spec) {
  const verify = (value, property) => {
    type.array.verify(value, property);
    value.forEach((element, index) =>
      itemTest.verify(element, arrayPath(property, index)));
  };
  lazy(verify, 'read',
    () => createArrayItemReader(itemTest, verify));
  return lazy(verify, 'write',
    () => createArrayItemWriter(itemTest, item_spec));
}

function createArrayItemReader(itemTest, verify) {
  return (value, emitter, base) => {
    verify(value);
    Reflect.set(value, RAW_SYMBOL, value);
    return new Proxy(value, {
      get: createItemGetter(itemTest, emitter, base, 'read'),
      set: failSet,
      deleteProperty: failDelete
    });
  };
}

function createArrayItemWriter(itemTest, item_spec) {
  return (array, emitter, base) => {
    if (emitter) {
      emitArrayEvents(array, emitter, base, itemTest, item_spec);
    }
    return new Proxy(array, {
      get: createItemGetter(itemTest, emitter, base, 'write'),
      set(target, key, value) {
        if (key !== 'length') {
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
    failSchemaValidation(new TypeError(`Expected property "${
      arrayPath(base, key)}" to be a valid array index`));
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

function verifyArrayMethodValues(base, method, offset, values, itemTest,
    item_spec) {
  values.forEach((value, i) => {
    if (itemTest(value) === false) {
      failSchemaValidation(new TypeError(`Expected argument ${
        i + offset + 1} of ${base}.${method} to be ${
        specName(item_spec)} but got ${stringify(value)}`));
    }
  });
}
