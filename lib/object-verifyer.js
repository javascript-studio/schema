'use strict';

const { RAW_SYMBOL } = require('./constants');
const { objectPath } = require('./path');
const { lazy } = require('./lazy');
const { type } = require('./type');
const {
  failSchemaValidation,
  failSet,
  failDelete,
  failNotSchemaObject
} = require('./fail');

exports.objectVerifyer = objectVerifyer;

function objectVerifyer(tests) {
  const test_keys = Object.keys(tests);
  const verify = (value, property, opt) => {
    type.object.verify(value, property);
    const value_keys = Object.keys(value);
    (opt ? value_keys : test_keys)
      .forEach(key => getTest(tests, key, property)
        .verify(value[key], objectPath(property, key))
      );
    if (!opt && value_keys.length !== test_keys.length) {
      value_keys.forEach(key => getTest(tests, key, property));
    }
    return value;
  };
  verify.verify = verifyWriter(verify);
  verify.raw = raw;
  lazy(verify, 'read', () => createReader(tests, verify));
  lazy(verify, 'write', () => createWriter(tests));
  return verify;
}

function getTest(tests, key, base) {
  return tests[key] || failSchemaValidation(
    new ReferenceError(`Invalid property "${objectPath(base, key)}"`));
}

function raw(value) {
  return value[RAW_SYMBOL] || failNotSchemaObject();
}

function verifyWriter(verify) {
  return (value) => value[RAW_SYMBOL] && verify(value[RAW_SYMBOL])
    || failNotSchemaObject();
}

function createReader(tests, verify) {
  return (value, emitter, base) => {
    verify(value);
    Reflect.set(value, RAW_SYMBOL, value);
    return new Proxy(value, {
      get: createPropertyGetter(tests, emitter, base, 'read'),
      set: failSet,
      deleteProperty: failDelete
    });
  };
}

function createWriter(tests) {
  return (value, emitter, base) => {
    type.object.verify(value);
    Object.keys(value).forEach(key => getTest(tests, key, base)
      .verify(value[key], key, true));
    Reflect.set(value, RAW_SYMBOL, value);
    return new Proxy(value, {
      get: createPropertyGetter(tests, emitter, base, 'write'),
      set(target, key, value) {
        if (type.string(key)) {
          const path = objectPath(base, key);
          getTest(tests, key, base).verify(value, path, true);
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
      },
      deleteProperty(target, key) {
        if (emitter && type.string(key)) {
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

function createPropertyGetter(tests, emitter, base, read_write) {
  const cache = Object.create(null);
  return (target, key) => {
    if (key === 'toJSON') {
      if (read_write === 'write') {
        Object.keys(tests).forEach(key => tests[key].verify(target[key], key));
      }
      return null;
    }
    if (key === 'then' || key === 'inspect') {
      return null;
    }
    const value = Reflect.get(target, key);
    // Key might be Symbol and value a prototype function:
    if (type.string(key) && !type.function(value)) {
      const test = getTest(tests, key, base);
      if (value === undefined) {
        return value;
      }
      const factory = test.verify && test.verify[read_write];
      if (factory) {
        return (cache[key]
          || (cache[key] = factory(value, emitter, objectPath(base, key))));
      }
    }
    return value;
  };
}
