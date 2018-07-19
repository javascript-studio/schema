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

function fail(value, name, property) {
  if (property) {
    throw new TypeError(`Expected property "${property}" to be ${name} `
      + `but got ${stringify(value)}`);
  }
  throw new TypeError(`Expected ${name} but got ${stringify(value)}`);
}

function invalidProperty(key) {
  throw new TypeError(`Invalid property "${key}"`);
}

function getTest(tests, key) {
  return tests[key] || invalidProperty(key);
}

function createName(spec) {
  if (spec === null) {
    return 'null';
  }
  if (typeof spec === 'function') {
    if (spec.createName) {
      return spec.createName();
    }
    return spec.name || 'custom value';
  }
  if (typeof spec === 'object') {
    const p = Object.keys(spec).map(key => `${key}:${createName(spec[key])}`);
    return `{${p.join(',')}}`;
  }
  return String(spec);
}

function verifyer(fn, spec) {
  return (value, property) => {
    if (fn(value, property) === false) {
      fail(value, createName(spec), property);
    }
  };
}

function createToJSON(tests) {
  return function () {
    for (const key of Object.keys(tests)) {
      tests[key].verify(this[key], key);
    }
    return this;
  };
}

function defaultToJSON() {
  return this;
}

function createPropertyGetter(tests, toJSON) {
  return function (target, key) {
    if (key === 'toJSON') {
      return toJSON;
    }
    getTest(tests, key);
    return Reflect.get(...arguments);
  };
}

function createReader(tester) {
  const propertyGetter = createPropertyGetter(tester.tests, defaultToJSON);
  return (value) => {
    tester.verify(value);
    return new Proxy(value, {
      get: propertyGetter,
      set: failSet,
      deleteProperty: failDelete
    });
  };
}

const testNull = v => v === null;
const type = {
  boolean: v => typeof v === 'boolean',
  number: v => typeof v === 'number' && isFinite(v),
  integer: v => typeof v === 'number' && isFinite(v) && Math.floor(v) === v,
  string: v => typeof v === 'string',
  object: v => toString.call(v) === '[object Object]'
};

testNull.verify = verifyer(testNull, 'null');
Object.keys(type).forEach(key => (type[key].verify = verifyer(type[key], key)));

function createWriter(tests) {
  const propertyGetter = createPropertyGetter(tests, createToJSON(tests));
  const propertySetter = function (target, key, value) {
    getTest(tests, key).verify(value, key);
    return Reflect.set(...arguments);
  };
  return (value) => {
    type.object.verify(value);
    const value_keys = Object.keys(value);
    for (const key of value_keys) {
      tests[key].verify(value[key], key);
    }
    return new Proxy(value, {
      get: propertyGetter,
      set: propertySetter
    });
  };
}

let createTest = null;

function createObjectTest(spec) {
  const tests = {};
  const test_keys = Object.keys(spec);
  for (const key of test_keys) {
    tests[key] = createTest(spec[key]);
  }
  const test = (value) => {
    if (!type.object(value)) {
      return false;
    }
    if (test_keys.some(key => !tests[key](value[key], key))) {
      return false;
    }
    const value_keys = Object.keys(value);
    return value_keys.length === test_keys.length
      || value_keys.every(key => tests[key]);
  };
  test.tests = tests;
  test.verify = (value) => {
    type.object.verify(value);
    test_keys.forEach(key => tests[key].verify(value[key], key));
    const value_keys = Object.keys(value);
    if (value_keys.length !== test_keys.length) {
      value_keys.forEach(key => getTest(tests, key));
    }
  };
  return test;
}

function failSpec(spec) {
  throw new Error(`Invalid spec ${stringify(spec)}`);
}

createTest = function (spec) {
  if (spec === null) {
    return testNull;
  }
  if (typeof spec === 'object') {
    return createObjectTest(spec);
  }
  if (typeof spec === 'function') {
    const t = (value, property) => spec(value, property) !== false;
    t.verify = verifyer(t, spec);
    return t;
  }
  return type[spec] || failSpec(spec);
};

function createObjectSchema(spec) {
  const test = createObjectTest(spec);
  const verify = test.verify;
  let read, write;
  Object.defineProperty(verify, 'read', {
    get: () => read || (read = createReader(test))
  });
  Object.defineProperty(verify, 'write', {
    get: () => write || (write = createWriter(test.tests))
  });
  return verify;
}

function createSchema(spec, name) {
  if (spec === null) {
    return testNull.verify;
  }
  if (typeof spec === 'object') {
    return createObjectSchema(spec);
  }
  if (typeof spec === 'function') {
    return verifyer(spec, name || spec);
  }
  return (type[spec] || failSpec(spec)).verify;
}

createSchema.spec = createSchema;

createSchema.opt = function (spec) {
  const test = createTest(spec);
  const opt = (value, property, op) => {
    if (value !== undefined || op === 'set') {
      if (property) {
        return test(value, property);
      }
      test.verify(value);
    }
    return true;
  };
  opt.verify = verifyer(opt, spec); // TODO has no tests
  opt.createName = () => `opt(${createName(spec)})`;
  return opt;
};

const map = Array.prototype.map;

createSchema.one = function () {
  if (arguments.length < 2) {
    throw new Error('Require at least two arguments');
  }
  const tests = map.call(arguments, createTest);
  return (value, property) => {
    if (tests.every(test => !test(value, true))) {
      const names = map.call(arguments, spec => createName(spec));
      const l = names.length - 1;
      const name = `one of ${names.slice(0, l).join(', ')} or ${names[l]}`;
      fail(value, name, property);
    }
  };
};

module.exports = createSchema;
