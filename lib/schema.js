'use strict';

const toString = Object.prototype.toString;

function stringify(value) {
  if (typeof value === 'function') {
    return 'function';
  }
  if (typeof value === 'number' || toString.call(value) === '[object RegExp]') {
    return String(value); // NaN and Infinity
  }
  return JSON.stringify(value);
}

function failSet() {
  throw new Error('Invalid assignment on read-only object');
}

function failDelete() {
  throw new Error('Invalid delete on read-only object');
}

function failProperty(key) {
  throw new TypeError(`Invalid property "${key}"`);
}

function fail(value, name, property) {
  if (property) {
    throw new TypeError(`Expected property "${property}" to be ${name} `
      + `but got ${stringify(value)}`);
  }
  throw new TypeError(`Expected ${name} but got ${stringify(value)}`);
}

function specName(spec) {
  if (spec === null) {
    return 'null';
  }
  if (typeof spec === 'function') {
    return spec.specName || 'custom value';
  }
  if (typeof spec === 'object') {
    const p = Object.keys(spec).map(key => `${key}:${specName(spec[key])}`);
    return `{${p.join(',')}}`;
  }
  return spec;
}

function getTest(tests, key) {
  return tests[key] || failProperty(key);
}

function verifyer(fn, spec) {
  return (value, property) => fn(value, property) === false
    ? fail(value, specName(spec), property)
    : value;
}

function createPropertyGetter(tests, type) {
  const cache = Object.create(null);
  return function (target, key) {
    if (key === 'toJSON') {
      if (type === 'write') {
        Object.keys(tests).forEach(key => tests[key].verify(target[key], key));
      }
      return null;
    }
    const value = Reflect.get(target, key);
    if (typeof key === 'string') { // Key might be Symbol
      const test = getTest(tests, key);
      const factory = test.verify && test.verify[type];
      if (factory) {
        return value === undefined
          ? value : (cache[key] || (cache[key] = factory(value)));
      }
    }
    return value;
  };
}

function createReader(tests, verify) {
  return (value) => {
    verify(value);
    return new Proxy(value, {
      get: createPropertyGetter(tests, 'read'),
      set: failSet,
      deleteProperty: failDelete
    });
  };
}

const type = {
  null: v => v === null,
  boolean: v => typeof v === 'boolean',
  number: v => typeof v === 'number' && isFinite(v),
  integer: v => typeof v === 'number' && isFinite(v) && Math.floor(v) === v,
  string: v => typeof v === 'string',
  object: v => toString.call(v) === '[object Object]'
};

Object.keys(type).forEach(key => (type[key].verify = verifyer(type[key], key)));

function createWriter(tests) {
  const propertySetter = (target, key, value) => {
    getTest(tests, key).verify(value, key, true);
    return Reflect.set(target, key, value);
  };
  return (value) => {
    type.object.verify(value);
    Object.keys(value).forEach(key => getTest(tests, key)
      .verify(value[key], key, true));
    return new Proxy(value, {
      get: createPropertyGetter(tests, 'write'),
      set: propertySetter
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
      .verify(value[key], property ? `${property}.${key}` : key));
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
  throw new Error(`Invalid spec ${stringify(spec)}`);
}

function object(spec) {
  const tests = specTests(spec);
  const test = objectTester(tests);
  return lazy(test, 'verify', () => objectVerifyer(tests));
}

specTest = function (spec) {
  if (spec === null) {
    return type.null;
  }
  if (typeof spec === 'object') {
    return object(spec);
  }
  if (typeof spec === 'function') {
    if (spec.verify) {
      return spec;
    }
    const t = spec.specName ? spec : (value, property) => spec(value, property);
    return lazy(t, 'verify', () => verifyer(t, spec));
  }
  return type[spec] || failSpec(spec);
};

function schema(spec) {
  if (typeof spec === 'object') {
    return objectVerifyer(specTests(spec));
  }
  if (typeof spec === 'function') {
    return spec.verify || verifyer(spec, spec);
  }
  return failSpec(spec);
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
  type.object.verify(spec);
  const test = object(spec);
  return lazy(test, 'specName', () => `object(${specName(spec)})`);
};

function arrayVerifyer(verify) {
  return (value, property) => value.forEach((element, index) =>
    verify(element, property ? `${property}[${index}]` : String(index)));
}

schema.array = (spec) => {
  const test = spec.verify ? spec : (type.object.verify(spec), object(spec));
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

module.exports = schema;
