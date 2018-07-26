'use strict';

const SCHEMA_VALIDATION = 'SCHEMA_VALIDATION';
const toString = Object.prototype.toString;

function typeOf(value) {
  const str = toString.call(value);
  return str.substring(8, str.length - 1);
}

const serialize = {
  Function: () => 'function',
  Number: String, // NaN and Infinity
  RegExp: String,
  Arguments: String
};
function stringify(value) {
  return (serialize[typeOf(value)] || JSON.stringify)(value);
}

function failSchemaValidation(error) {
  throw Object.defineProperty(error, 'code', { value: SCHEMA_VALIDATION });
}

function failSet() {
  failSchemaValidation(new Error('Invalid assignment on read-only object'));
}

function failDelete() {
  failSchemaValidation(new Error('Invalid delete on read-only object'));
}

let specName = null;
const spec_name = {
  Function: spec => spec.specName || 'custom value',
  Object: spec => {
    const p = Object.keys(spec).map(key => `${key}:${specName(spec[key])}`);
    return `{${p.join(', ')}}`;
  }
};
specName = spec => (spec_name[typeOf(spec)] || String)(spec);

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

function createPropertyGetter(tests, parent, type) {
  const cache = Object.create(null);
  return (target, key) => {
    if (key === 'toJSON') {
      if (type === 'write') {
        Object.keys(tests).forEach(key => tests[key].verify(target[key], key));
      }
      return null;
    }
    const value = Reflect.get(target, key);
    if (typeof key === 'string') { // Key might be Symbol
      const test = getTest(tests, key, parent);
      const factory = test.verify && test.verify[type];
      if (factory) {
        return value === undefined ? value : (cache[key]
          || (cache[key] = factory(value, path(parent, key))));
      }
    }
    return value;
  };
}

function createPropertySetter(tests, parent) {
  return (target, key, value) => {
    getTest(tests, key, parent).verify(value, key, true);
    return Reflect.set(target, key, value);
  };
}

function createReader(tests, verify) {
  return (value, parent) => {
    verify(value);
    return new Proxy(value, {
      get: createPropertyGetter(tests, parent, 'read'),
      set: failSet,
      deleteProperty: failDelete
    });
  };
}

function createWriter(tests) {
  return (value, parent) => {
    type.object.verify(value);
    Object.keys(value).forEach(key => getTest(tests, key, parent)
      .verify(value[key], key, true));
    return new Proxy(value, {
      get: createPropertyGetter(tests, parent, 'write'),
      set: createPropertySetter(tests, parent)
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

function lazy(object, property, factory) {
  let cache;
  return Object.defineProperty(object, property, {
    get: () => cache || (cache = factory())
  });
}

function verifyWriter(value) {
  return JSON.parse(JSON.stringify(value));
}

function objectVerifyer(tests) {
  const test_keys = Object.keys(tests);
  const verify = (value, property, opt) => {
    type.object.verify(value, property);
    const value_keys = Object.keys(value);
    (opt ? value_keys : test_keys).forEach(key => getTest(tests, key)
      .verify(value[key], path(property, key)));
    if (!opt && value_keys.length !== test_keys.length) {
      value_keys.forEach(key => getTest(tests, key));
    }
    return value;
  };
  verify.verify = verifyWriter;
  lazy(verify, 'read', () => createReader(tests, verify));
  return lazy(verify, 'write', () => createWriter(tests));
}

function failSpec(spec) {
  throw new TypeError(`Invalid spec ${stringify(spec)}`);
}

function object(spec) {
  const tests = specTests(spec);
  const test = objectTester(tests);
  return lazy(test, 'verify', () => objectVerifyer(tests));
}

function func(spec) {
  const t = spec.specName ? spec : (value, property) => spec(value, property);
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
  return lazy(opt, 'specName', () => `opt(${specName(spec)})`);
};

const slice = Array.prototype.slice;

schema.one = function () {
  if (arguments.length < 2) {
    throw new Error('Require at least two arguments');
  }
  const specs = slice.call(arguments);
  const tests = specs.map(specTest);
  const test = value => tests.some(test => test(value));
  return lazy(test, 'specName', () => `one(${specs.map(specName).join(', ')})`);
};

schema.object = (spec) => {
  if (!type.object(spec)) {
    throw new TypeError(`Expected object but got ${stringify(spec)}`);
  }
  const test = object(spec);
  return lazy(test, 'specName', () => `object(${specName(spec)})`);
};

function arrayVerifyer(verify) {
  return (value, property) => value.forEach((element, index) =>
    verify(element, property ? `${property}[${index}]` : String(index)));
}

schema.array = (spec) => {
  const test = spec.verify ? spec : specTest(spec);
  const array = value => value.every(test);
  array.verify = arrayVerifyer(test.verify);
  return lazy(array, 'specName', () => `array(${specName(spec)})`);
};

schema.keyValue = function (key_spec, value_spec) {
  const keyTest = specTest(key_spec);
  const valueTest = specTest(value_spec);
  const keyValue = value => type.object(value)
    && Object.keys(value).every(key => keyTest(key)
      && valueTest(value[key], key));
  return lazy(keyValue, 'specName',
    () => `keyValue(${specName(key_spec)}, ${specName(value_spec)})`);
};

schema.SCHEMA_VALIDATION = SCHEMA_VALIDATION;

module.exports = schema;
