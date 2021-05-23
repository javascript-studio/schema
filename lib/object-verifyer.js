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
  return lazy(verify, 'write', () => createWriter(tests));
}

function getTest(tests, key, parent) {
  return tests[key] || failSchemaValidation(
    new ReferenceError(`Invalid property "${objectPath(parent, key)}"`));
}

function raw(value) {
  return value[RAW_SYMBOL] || failNotSchemaObject();
}

function verifyWriter(verify) {
  return (value) => value[RAW_SYMBOL] && verify(value[RAW_SYMBOL])
    || failNotSchemaObject();
}

function createReader(tests, verify) {
  return (value, emitter, parent) => {
    verify(value);
    Reflect.set(value, RAW_SYMBOL, value);
    return new Proxy(value, {
      get: createPropertyGetter(tests, emitter, parent, 'read'),
      set: failSet,
      deleteProperty: failDelete
    });
  };
}

function createWriter(tests) {
  return (value, emitter, parent) => {
    type.object.verify(value);
    Object.keys(value).forEach(key => getTest(tests, key, parent)
      .verify(value[key], key, true));
    Reflect.set(value, RAW_SYMBOL, value);
    return new Proxy(value, {
      get: createPropertyGetter(tests, emitter, parent, 'write'),
      set(target, key, value) {
        if (typeof key === 'string') {
          getTest(tests, key, parent)
            .verify(value, objectPath(parent, key), true);
          if (emitter) {
            emitter.emit('set', objectPath(parent, key), value);
          }
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

function createPropertyGetter(tests, emitter, parent, type) {
  const cache = Object.create(null);
  return (target, key) => {
    if (key === 'toJSON') {
      if (type === 'write') {
        Object.keys(tests).forEach(key => tests[key].verify(target[key], key));
      }
      return null;
    }
    if (key === 'then' || key === 'inspect') {
      return null;
    }
    const value = Reflect.get(target, key);
    // Key might be Symbol and value a prototype function:
    if (typeof key === 'string' && typeof value !== 'function') {
      const test = getTest(tests, key, parent);
      if (value === undefined) {
        return value;
      }
      const factory = test.verify && test.verify[type];
      if (factory) {
        return (cache[key]
          || (cache[key] = factory(value, emitter, objectPath(parent, key))));
      }
    }
    return value;
  };
}
