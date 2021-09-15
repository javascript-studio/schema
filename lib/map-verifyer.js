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
  const verify = createVerify(keyVerify, valueTest);
  lazy(verify, 'read', () => createMapValueReader(valueTest, verify));
  lazy(verify, 'write', () => createMapValueWriter(valueTest));
  return verify;
}

function createVerify(keyVerify, valueTest) {
  return (value, options = {}, base = undefined) => {
    assertType(value, 'Object', base, options.error_code);
    Object.entries(value).forEach(([key, item]) => {
      const ref = objectPath(base, key);
      keyVerify(key, options, ref);
      valueTest.verify(item, options, ref);
    });
    return value;
  };
}

function createMapValueReader(valueTest, verify) {
  return (map, options, base) => {
    const cache = Object.create(null);
    return new Proxy(verify(unwrap(map), options), {
      get: createItemGetter(
        cache,
        valueTest,
        options,
        base,
        'read',
        objectPath
      ),
      set: failSet,
      deleteProperty: failDelete
    });
  };
}

function createMapValueWriter(valueTest) {
  return (map, options, base) => {
    const cache = Object.create(null);
    return new Proxy(unwrap(map), {
      get: createItemGetter(
        cache,
        valueTest,
        options,
        base,
        'write',
        objectPath
      ),
      set: createItemSetter(cache, valueTest, options, base),
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
        delete cache[key];
        return Reflect.deleteProperty(target, key);
      }
    });
  };
}

function createItemSetter(cache, valueTest, options, base) {
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
    delete cache[key];
    return Reflect.set(target, key, value);
  };
}
