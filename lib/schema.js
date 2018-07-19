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

function custom(fn, name) {
  return (value, property) => {
    if (fn(value) === false) {
      if (property) {
        throw new TypeError(`Expected property "${property}" to be ${name} `
          + `but got ${stringify(value)}`);
      }
      throw new TypeError(`Expected ${name} but got ${stringify(value)}`);
    }
  };
}

function invalidProperty(key) {
  throw new TypeError(`Invalid property "${key}"`);
}

function getSchema(schemas, key) {
  return schemas[key] || invalidProperty(key);
}

function createToJSON(schemas, schema_keys) {
  return function () {
    for (const key of schema_keys) {
      schemas[key](this[key], key);
    }
    return this;
  };
}

function defaultToJSON() {
  return this;
}

function createPropertyGetter(schemas, toJSON) {
  return function (target, key) {
    if (key === 'toJSON') {
      return toJSON;
    }
    getSchema(schemas, key);
    return Reflect.get(...arguments);
  };
}

function createReader(validator, schemas) {
  const propertyGetter = createPropertyGetter(schemas, defaultToJSON);
  return (value) => {
    validator(value);
    return new Proxy(value, {
      get: propertyGetter,
      set: failSet,
      deleteProperty: failDelete
    });
  };
}

const isNull = custom(v => v === null, 'null');
const string_specs = {
  boolean: custom(v => typeof v === 'boolean', 'boolean'),
  number: custom(v => typeof v === 'number' && isFinite(v), 'number'),
  integer: custom(v => typeof v === 'number' && isFinite(v)
    && Math.floor(v) === v, 'integer'),
  string: custom(v => typeof v === 'string', 'string'),
  object: custom(v => toString.call(v) === '[object Object]', 'object')
};

function createWriter(schemas, schema_keys) {
  const propertyGetter = createPropertyGetter(schemas,
    createToJSON(schemas, schema_keys));
  const propertySetter = function (target, key, value) {
    getSchema(schemas, key)(value, key);
    return Reflect.set(...arguments);
  };
  return (value) => {
    string_specs.object(value);
    const value_keys = Object.keys(value);
    for (const key of value_keys) {
      schemas[key](value[key], key);
    }
    return new Proxy(value, {
      get: propertyGetter,
      set: propertySetter
    });
  };
}

let createSchema = null;

function object(spec) {
  const schemas = {};
  const schema_keys = Object.keys(spec);
  for (const key of schema_keys) {
    schemas[key] = createSchema(spec[key]);
  }
  const validator = (value) => {
    string_specs.object(value);
    for (const key of schema_keys) {
      schemas[key](value[key], key);
    }
    const value_keys = Object.keys(value);
    if (value_keys.length !== schema_keys.length) {
      for (const key of value_keys) {
        getSchema(schemas, key);
      }
    }
  };
  let read, write;
  Object.defineProperty(validator, 'read', {
    get: () => read || (read = createReader(validator, schemas))
  });
  Object.defineProperty(validator, 'write', {
    get: () => write || (write = createWriter(schemas, schema_keys))
  });
  return validator;
}

createSchema = function (spec, name) {
  if (spec === null) {
    return isNull;
  }
  if (typeof spec === 'object') {
    return object(spec);
  }
  if (typeof spec === 'function') {
    return custom(spec, name || spec.name || 'custom value');
  }
  const schema = string_specs[spec];
  if (schema) {
    return schema;
  }
  throw new Error(`Invalid spec ${stringify(spec)}`);
};

createSchema.spec = createSchema;

module.exports = createSchema;
