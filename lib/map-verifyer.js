'use strict';

const { lazy } = require('./lazy');
const { objectPath, unwrap, assertType } = require('./util');
const { failSet, failDelete } = require('./fail');
const { createItemGetter } = require('./create-item-getter');

exports.mapVerifyer = mapVerifyer;

function mapVerifyer(keyVerify, valueTest) {
  const verify = (value, property) => {
    assertType(value, 'Object', property);
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
  return (map, emitter, parent) => {
    return new Proxy(verify(unwrap(map)), {
      get: createItemGetter(valueTest, emitter, parent, 'read'),
      set: failSet,
      deleteProperty: failDelete
    });
  };
}

function createMapValueWriter(valueTest) {
  return (map, emitter, parent) => {
    return new Proxy(unwrap(map), {
      get: createItemGetter(valueTest, emitter, parent, 'write'),
      set(target, key, value) {
        value = unwrap(value);
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
