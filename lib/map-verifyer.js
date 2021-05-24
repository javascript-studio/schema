'use strict';

const { RAW_SYMBOL } = require('./constants');
const { lazy } = require('./lazy');
const { objectPath } = require('./path');
const { type } = require('./type');
const { failSet, failDelete } = require('./fail');
const { createItemGetter } = require('./create-item-getter');

exports.mapVerifyer = mapVerifyer;

function mapVerifyer(keyVerify, valueTest) {
  const verify = (value, property) => {
    type.object.verify(value, property);
    Object.entries(value).forEach(([key, item]) => {
      const ref = objectPath(property, key);
      keyVerify(key, ref);
      valueTest.verify(item, ref);
    });
    return value;
  };
  lazy(verify, 'read', () => createMapValueReader(valueTest, verify));
  lazy(verify, 'write', () => createMapValueWriter(valueTest));
  return verify;
}

function createMapValueReader(valueTest, verify) {
  return (value, emitter, parent) => {
    verify(value);
    Reflect.set(value, RAW_SYMBOL, value);
    return new Proxy(value, {
      get: createItemGetter(valueTest, emitter, parent, 'read'),
      set: failSet,
      deleteProperty: failDelete
    });
  };
}

function createMapValueWriter(valueTest) {
  return (value, emitter, parent) => {
    return new Proxy(value, {
      get: createItemGetter(valueTest, emitter, parent, 'write'),
      set(target, key, value) {
        valueTest.verify(value, objectPath(parent, key));
        if (emitter) {
          emitter.emit('set', objectPath(parent, key), value);
        }
        return Reflect.set(target, key, value);
      },
      deleteProperty(target, key) {
        if (emitter) {
          emitter.emit('delete', objectPath(parent, key));
        }
        return Reflect.deleteProperty(target, key);
      }
    });
  };
}
