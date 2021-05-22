'use strict';

const { lazy } = require('./lazy');
const { typeOf } = require('./type-of');
const { stringify } = require('./stringify');
const { SCHEMA_VALIDATION, RAW_SYMBOL } = require('./constants');
const {
  failSchemaValidation,
  failSet,
  failDelete,
  failNotSchemaObject,
  failSpec
} = require('./fail');
const { specName, SPEC_NAME } = require('./spec-name');

function path(parent, key) {
  return parent ? `${parent}.${key}` : key;
}

function getTest(tests, key, parent) {
  return tests[key] || failSchemaValidation(
    new ReferenceError(`Invalid property "${path(parent, key)}"`));
}

function verifyer(fn, spec) {
  return (value, property) => {
    if (fn(value, property) === false) {
      const expectation = `${specName(spec)} but got ${stringify(value)}`;
      failSchemaValidation(new TypeError(property
        ? `Expected property "${property}" to be ${expectation}`
        : `Expected ${expectation}`));
    }
    return value;
  };
}

function keyVerifyer(fn, spec) {
  return (key, property) => {
    if (fn(key, property) === false) {
      failSchemaValidation(new TypeError(property && property !== key
        ? `Expected key "${key}" in "${property}" to be ${specName(spec)}`
        : `Expected key "${key}" to be ${specName(spec)}`));
    }
    return property;
  };
}

const type = {
  null: v => v === null,
  defined: v => v !== undefined,
  optional: () => {},
  boolean: v => typeof v === 'boolean',
  number: v => typeof v === 'number' && isFinite(v),
  integer: v => typeof v === 'number' && isFinite(v) && Math.floor(v) === v,
  string: v => typeof v === 'string',
  object: v => typeOf(v) === 'Object',
  array: v => typeOf(v) === 'Array'
};

Object.keys(type).forEach(key => (type[key].verify = verifyer(type[key], key)));

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
          || (cache[key] = factory(value, emitter, path(parent, key))));
      }
    }
    return value;
  };
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
          getTest(tests, key, parent).verify(value, path(parent, key), true);
          if (emitter) {
            emitter.emit('set', path(parent, key), value);
          }
        }
        return Reflect.set(target, key, value);
      },
      deleteProperty(target, key) {
        if (emitter) {
          emitter.emit('delete', path(parent, key));
        }
        return Reflect.deleteProperty(target, key);
      }
    });
  };
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

function createItemGetter(valueTest, emitter, parent, type) {
  const cache = Object.create(null);
  return (target, key) => {
    if (key === 'toJSON') {
      return () => target;
    }
    const value = Reflect.get(target, key);
    // Key might be Symbol and value a prototype function:
    if (typeof key === 'string'
        && typeof value !== 'function'
        && value !== undefined) {
      const factory = valueTest.verify && valueTest.verify[type];
      if (factory) {
        return (cache[key]
          || (cache[key] = factory(value, emitter, path(parent, key))));
      }
    }
    return value;
  };
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
              path(parent, key)}" to be a valid array index`));
          }
          itemTest.verify(value, path(parent, key));
          if (emitter) {
            emitter.emit('set', path(parent, key), value);
          }
        }
        return Reflect.set(target, key, value);
      },
      deleteProperty(target, key) {
        if (emitter) {
          emitter.emit('delete', path(parent, key));
        }
        return Reflect.deleteProperty(target, key);
      }
    });
  };
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
        valueTest.verify(value, path(parent, key));
        if (emitter) {
          emitter.emit('set', path(parent, key), value);
        }
        return Reflect.set(target, key, value);
      },
      deleteProperty(target, key) {
        if (emitter) {
          emitter.emit('delete', path(parent, key));
        }
        return Reflect.deleteProperty(target, key);
      }
    });
  };
}

let specTest = null;

function specTests(spec) {
  const tests = {};
  for (const key of Object.keys(spec)) {
    tests[key] = specTest(spec[key]);
  }
  return tests;
}

function objectTester(tests) {
  return (value) => type.object(value)
    && Object.keys(tests).every(key => tests[key](value[key], key))
    && Object.keys(value).every(key => Boolean(tests[key]));
}

function verifyWriter(verify) {
  return (value) => value[RAW_SYMBOL] && verify(value[RAW_SYMBOL])
    || failNotSchemaObject();
}

function raw(value) {
  return value[RAW_SYMBOL] || failNotSchemaObject();
}

function objectVerifyer(tests) {
  const test_keys = Object.keys(tests);
  const verify = (value, property, opt) => {
    type.object.verify(value, property);
    const value_keys = Object.keys(value);
    (opt ? value_keys : test_keys)
      .forEach(key => getTest(tests, key, property)
        .verify(value[key], path(property, key))
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

function object(spec) {
  const tests = specTests(spec);
  const test = objectTester(tests);
  return lazy(test, 'verify', () => objectVerifyer(tests));
}

function func(spec) {
  const t = spec[SPEC_NAME] ? spec : (value, property) => spec(value, property);
  return lazy(t, 'verify', () => verifyer(t, spec));
}

function regexp(spec) {
  const t = v => typeof v === 'string' && spec.test(v);
  return lazy(t, 'verify', () => verifyer(t, spec));
}

const spec_type = {
  Null: () => type.null,
  Boolean: spec => spec ? type.defined : type.optional,
  String: spec => type[spec] || failSpec(spec),
  RegExp: regexp,
  Object: object,
  Function: spec => spec.verify ? spec : func(spec)
};
specTest = function (spec) {
  return (spec_type[typeOf(spec)] || failSpec)(spec);
};

const schema_type = {
  Object: spec => objectVerifyer(specTests(spec)),
  Function: spec => spec.verify || verifyer(spec, spec)
};
function schema(spec) {
  return (schema_type[typeOf(spec)] || failSpec)(spec);
}

schema.spec = schema;

schema.opt = function (spec) {
  const test = specTest(spec);
  const opt = value => value === undefined || test(value);
  return lazy(opt, SPEC_NAME, () => `opt(${specName(spec)})`);
};

const slice = Array.prototype.slice;

schema.one = function () {
  if (arguments.length < 2) {
    throw new Error('Require at least two arguments');
  }
  const specs = slice.call(arguments);
  const tests = specs.map(specTest);
  const test = value => tests.some(test => test(value));
  return lazy(test, SPEC_NAME, () => `one(${specs.map(specName).join(', ')})`);
};

schema.object = (spec) => {
  if (!type.object(spec)) {
    throw new TypeError(`Expected object but got ${stringify(spec)}`);
  }
  const test = object(spec);
  return lazy(test, SPEC_NAME, () => `object(${specName(spec)})`);
};

function arrayVerifyer(itemTest, item_spec) {
  const verify = (value, property) => {
    type.array.verify(value, property);
    value.forEach((element, index) =>
      itemTest.verify(element, path(property, String(index))));
  };
  lazy(verify, 'read',
    () => createArrayItemReader(itemTest, verify));
  return lazy(verify, 'write',
    () => createArrayItemWriter(itemTest, item_spec));
}

schema.array = (spec) => {
  const itemTest = spec.verify ? spec : specTest(spec);
  const arrayTest = value => type.array(value) && value.every(itemTest);
  arrayTest.verify = arrayVerifyer(itemTest, spec);
  return lazy(arrayTest, SPEC_NAME, () => `array(${specName(spec)})`);
};

function mapVerifyer(keyVerify, valueTest) {
  const verify = (value, property) => {
    type.object.verify(value, property);
    Object.entries(value).forEach(([key, item]) => {
      const ref = path(property, key);
      keyVerify(key, ref);
      valueTest.verify(item, ref);
    });
    return value;
  };
  lazy(verify, 'read', () => createMapValueReader(valueTest, verify));
  return lazy(verify, 'write', () => createMapValueWriter(valueTest));
}

schema.map = function (key_spec, value_spec) {
  const keyTest = specTest(key_spec);
  const valueTest = specTest(value_spec);
  const map = value => type.object(value)
    && Object.keys(value).every(key => keyTest(key) && valueTest(value[key]));
  map.verify = mapVerifyer(keyVerifyer(keyTest, key_spec), valueTest);
  return lazy(map, SPEC_NAME,
    () => `map(${specName(key_spec)}, ${specName(value_spec)})`);
};

schema.SCHEMA_VALIDATION = SCHEMA_VALIDATION;

module.exports = schema;
