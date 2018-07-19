'use strict';

function stringify(value) {
  if (typeof value === 'function') {
    return 'function';
  }
  return JSON.stringify(value);
}

function fail(name, property, value) {
  if (name) {
    if (property) {
      if (value === undefined) {
        throw new TypeError(`Missing property "${property}"`);
      }
      throw new TypeError(`Expected property "${property}" to be ${name} `
        + `but got ${stringify(value)}`);
    }
    throw new TypeError(`Expected ${name} but got ${stringify(value)}`);
  }
  throw new TypeError(`Unexpected ${stringify(value)}`);
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
      fail(name, property, value);
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

function createPropertySetter(schemas) {
  return function (target, key, value) {
    getSchema(schemas, key)(value, key);
    return Reflect.set(...arguments);
  };
}

function createPropertyDeleter(schemas) {
  return function (target, key) {
    getSchema(schemas, key);
    return Reflect.deleteProperty(...arguments);
  };
}

const toString = Object.prototype.toString;

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

function createWriter(schemas, schema_keys) {
  const propertyGetter = createPropertyGetter(schemas,
    createToJSON(schemas, schema_keys));
  const propertySetter = createPropertySetter(schemas);
  const propertyDeleter = createPropertyDeleter(schemas);
  return (value) => {
    if (toString.call(value) !== '[object Object]') {
      fail('object', null, value);
    }
    const value_keys = Object.keys(value);
    for (const key of value_keys) {
      schemas[key](value[key], key);
    }
    return new Proxy(value, {
      get: propertyGetter,
      set: propertySetter,
      deleteProperty: propertyDeleter
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
    if (toString.call(value) !== '[object Object]') {
      fail('object', null, value);
    }
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

const isTypeOf = (type, name) => custom(v => v !== null && typeof v === type,
  name ? `${name} ${type}` : type);
const isInteger = v => Math.floor(v) === v;
const isNull = v => v === null;

const string_specs = {
  integer: custom(isInteger, 'integer')
};
['boolean', 'number', 'string', 'object']
  .forEach(type => (string_specs[type] = isTypeOf(type)));

createSchema = function (spec, name) {
  if (spec === null) {
    return custom(isNull, 'null');
  }
  if (typeof spec === 'object') {
    return object(spec);
  }
  if (typeof spec === 'function') {
    return custom(spec, name);
  }
  const schema = string_specs[spec];
  if (schema) {
    return schema;
  }
  throw new Error(`Invalid spec ${stringify(spec)}`);
};

createSchema.spec = createSchema;

module.exports = createSchema;
