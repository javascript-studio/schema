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

function getTest(tests, key) {
  return tests[key] || (() => {
    throw new TypeError(`Invalid property "${key}"`);
  })();
}

function specName(spec) {
  if (spec === null) {
    return 'null';
  }
  if (typeof spec === 'function') {
    return spec.specName ? spec.specName() : 'custom value';
  }
  if (typeof spec === 'object') {
    const p = Object.keys(spec).map(key => `${key}:${specName(spec[key])}`);
    return `{${p.join(',')}}`;
  }
  return spec;
}

function verifyer(fn, spec) {
  return (value, property) => {
    if (fn(value, property) === false) {
      fail(value, specName(spec), property);
    }
  };
}

function createToJSON(tests) {
  return function () {
    Object.keys(tests).forEach(key => tests[key].verify(this[key], key));
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

function createReader(tests, verify) {
  const propertyGetter = createPropertyGetter(tests, defaultToJSON);
  return (value) => {
    verify(value);
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
    Object.keys(value).forEach(key => tests[key].verify(value[key], key));
    return new Proxy(value, {
      get: propertyGetter,
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

function objectVerifyer(tests) {
  return (value, property) => {
    type.object.verify(value, property);
    Object.keys(tests).forEach(key => tests[key].verify(value[key],
      property ? `${property}.${key}` : key));
    Object.keys(value).forEach(key => getTest(tests, key));
  };
}

function failSpec(spec) {
  throw new Error(`Invalid spec ${stringify(spec)}`);
}

specTest = function (spec) {
  if (spec === null) {
    return testNull;
  }
  if (typeof spec === 'object') {
    const tests = specTests(spec);
    const test = objectTester(tests);
    test.verify = objectVerifyer(tests);
    return test;
  }
  if (typeof spec === 'function') {
    const t = (value, property) => spec(value, property) !== false;
    t.verify = verifyer(t, spec);
    return t;
  }
  return type[spec] || failSpec(spec);
};

function proxyFactory(tests, verify) {
  let read, write;
  Object.defineProperty(verify, 'read', {
    get: () => read || (read = createReader(tests, verify))
  });
  Object.defineProperty(verify, 'write', {
    get: () => write || (write = createWriter(tests))
  });
}

function schema(spec) {
  if (typeof spec === 'object') {
    const tests = specTests(spec);
    const verify = objectVerifyer(tests);
    proxyFactory(tests, verify);
    return verify;
  }
  return failSpec(spec);
}

schema.spec = schema;

schema.opt = function (spec) {
  const test = specTest(spec);
  const opt = (value, property) => {
    if (value !== undefined) {
      return test(value, property);
    }
    return true;
  };
  opt.specName = () => `opt(${specName(spec)})`;
  return opt;
};

const map = Array.prototype.map;

schema.one = function () {
  if (arguments.length < 2) {
    throw new Error('Require at least two arguments');
  }
  const tests = map.call(arguments, specTest);
  return (value, property) => {
    if (tests.every(test => !test(value))) {
      const names = map.call(arguments, spec => specName(spec));
      const l = names.length - 1;
      const name = `one of ${names.slice(0, l).join(', ')} or ${names[l]}`;
      fail(value, name, property);
    }
  };
};

module.exports = schema;
