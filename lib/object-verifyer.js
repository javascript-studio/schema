'use strict';

const {
  objectPath,
  raw,
  unwrap,
  assertType,
  lazy,
  failSchemaValidation,
  failSet,
  failDelete
} = require('./util');

exports.objectVerifyer = objectVerifyer;

function objectVerifyer(tests, schema_options = {}) {
  /** @type {Object} */
  const verify = createVerify(tests);
  verify.verify = verifyWriter(verify, schema_options);
  lazy(verify, 'read', () => createReader(tests, verify, schema_options));
  lazy(verify, 'write', () => createWriter(tests, schema_options));
  return verify;
}

function createVerify(tests) {
  const test_keys = Object.keys(tests);
  return (value, options = {}, base = undefined, opt = false) => {
    assertType(value, 'Object', base, options.error_code);
    const value_keys = Object.keys(value);
    for (const key of opt ? value_keys : test_keys) {
      const test = getTest(tests, key, base, options);
      test.verify(value[key], options, objectPath(base, key));
    }
    if (!opt && value_keys.length !== test_keys.length) {
      for (const key of value_keys) {
        getTest(tests, key, base, options);
      }
    }
    return value;
  };
}

function getTest(tests, key, base, options) {
  return (
    tests[key] ||
    failSchemaValidation(
      new ReferenceError(`Invalid property "${objectPath(base, key)}"`),
      options.error_code
    )
  );
}

function verifyWriter(verify, schema_options) {
  return (value) => verify(raw(value), schema_options);
}

function createReader(tests, verify, schema_options) {
  return (object, options = schema_options, base = undefined) => {
    return new Proxy(verify(unwrap(object), options), {
      get: createPropertyGetter(tests, options, base, 'read'),
      set: failSet,
      deleteProperty: failDelete
    });
  };
}

function createWriter(tests, spec_options) {
  return (object, options = spec_options, base = undefined) => {
    object = unwrap(object);
    assertType(object, 'Object', base, options.error_code);
    for (const [key, value] of Object.entries(object)) {
      getTest(tests, key, base, options).verify(value, options, key, true);
    }
    return new Proxy(object, {
      get: createPropertyGetter(tests, options, base, 'write'),
      set: createPropertySetter(tests, options, base),
      deleteProperty(target, key) {
        const test = getTest(tests, key, base, options);
        if (!test.optional) {
          const path = objectPath(base, key);
          failSchemaValidation(
            new TypeError(`Invalid delete on non-optional property "${path}"`),
            options.error_code
          );
        }
        if (options.emitter && typeof key === 'string') {
          const path = objectPath(base, key);
          options.emitter.emit('delete', {
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

function createPropertyGetter(tests, options, base, read_write) {
  const cache = new WeakMap();
  return (target, key) => {
    if (key === 'toJSON') {
      return () => target;
    }
    if (key === 'then' || key === 'inspect' || key === 'nodeType') {
      return null;
    }
    const value = Reflect.get(target, key);
    // Key might be Symbol and value a prototype function:
    if (typeof key !== 'string' || typeof value === 'function') {
      return value;
    }
    const test = getTest(tests, key, base, options);
    if (value === null || typeof value !== 'object') {
      return value;
    }
    const factory = test.verify && test.verify[read_write];
    if (!factory) {
      return value;
    }
    if (cache.has(value)) {
      return cache.get(value);
    }
    const proxy = factory(value, options, objectPath(base, key));
    cache.set(value, proxy);
    return proxy;
  };
}

function createPropertySetter(tests, options, base) {
  return (target, key, value) => {
    if (typeof key === 'string') {
      value = unwrap(value);
      const path = objectPath(base, key);
      const test = getTest(tests, key, base, options);
      test.verify(value, options, path, false);
      if (options.emitter) {
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
    return Reflect.set(target, key, value);
  };
}
