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
  return (map, emitter, base) => {
    return new Proxy(verify(unwrap(map)), {
      get: createItemGetter(valueTest, emitter, base, 'read'),
      set: failSet,
      deleteProperty: failDelete
    });
  };
}

function createMapValueWriter(valueTest) {
  return (map, emitter, base) => {
    return new Proxy(unwrap(map), {
      get: createItemGetter(valueTest, emitter, base, 'write'),
      set: createItemSetter(valueTest, emitter, base),
      deleteProperty(target, key) {
        if (emitter && typeof key === 'string') {
          const path = objectPath(base, key);
          emitter.emit('delete', {
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

function createItemSetter(valueTest, emitter, base) {
  return (target, key, value) => {
    if (typeof key === 'string') {
      value = unwrap(value);
      const path = objectPath(base, key);
      valueTest.verify(value, path);
      if (emitter) {
        emitter.emit('set', {
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
