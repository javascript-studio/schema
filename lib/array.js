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
  return (value, emitter, parent) => {
    verify(value);
    Reflect.set(value, RAW_SYMBOL, value);
    return new Proxy(value, {
      get: createItemGetter(itemTest, emitter, parent, 'read'),
      set: failSet,
      deleteProperty: failDelete
    });
  };
}

function createArrayItemWriter(itemTest, item_spec) {
  return (array, emitter, parent) => {
    if (emitter) {
      emitArrayEvents(array, emitter, parent, itemTest, item_spec);
    }
    return new Proxy(array, {
      get: createItemGetter(itemTest, emitter, parent, 'write'),
      set(target, key, value) {
        if (key !== 'length') {
          const index = parseInt(key, 10);
          if (String(index) !== key || index < 0) {
            failSchemaValidation(new TypeError(`Expected property "${
              arrayPath(parent, key)}" to be a valid array index`));
          }
          itemTest.verify(value, arrayPath(parent, key));
          if (emitter) {
            emitter.emit('set', arrayPath(parent, key), value);
          }
        }
        return Reflect.set(target, key, value);
      },
      deleteProperty(target, key) {
        if (emitter) {
          emitter.emit('delete', arrayPath(parent, key));
        }
        return Reflect.deleteProperty(target, key);
      }
    });
  };
}

function emitArrayEvents(array, emitter, parent, itemTest, item_spec) {
  const proto = Object.create(Array.prototype);
  proto.push = (...values) => {
    verifyArrayMethodValues(parent, 'push', 0, values, itemTest, item_spec);
    emitter.emit('push', parent, ...values);
    return Array.prototype.push.call(array, ...values);
  };
  proto.pop = () => {
    emitter.emit('pop', parent);
    return Array.prototype.pop.call(array);
  };
  proto.shift = () => {
    emitter.emit('shift', parent);
    return Array.prototype.shift.call(array);
  };
  proto.unshift = (...values) => {
    verifyArrayMethodValues(parent, 'unshift', 0, values, itemTest, item_spec);
    emitter.emit('unshift', parent, ...values);
    return Array.prototype.unshift.call(array, ...values);
  };
  proto.splice = (start, delete_count, ...values) => {
    verifyArrayMethodValues(parent, 'splice', 2, values, itemTest, item_spec);
    emitter.emit('splice', parent, start, delete_count, ...values);
    return Array.prototype.splice.call(array, start, delete_count, ...values);
  };
  Object.setPrototypeOf(array, proto);
}

function verifyArrayMethodValues(parent, method, offset, values, itemTest,
    item_spec) {
  values.forEach((value, i) => {
    if (itemTest(value) === false) {
      failSchemaValidation(new TypeError(`Expected argument ${
        i + offset + 1} of ${parent}.${method} to be ${
        specName(item_spec)} but got ${stringify(value)}`));
    }
  });
}
