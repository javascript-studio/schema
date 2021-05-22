'use strict';

const { RAW_SYMBOL } = require('./constants');
const { lazy } = require('./lazy');
const { path } = require('./path');
const { type } = require('./type');
const { specName, SPEC_NAME } = require('./spec-name');
const { specTest } = require('./spec-test');
const { failSet, failDelete, failSchemaValidation } = require('./fail');
const { createItemGetter } = require('./create-item-getter');

exports.map = map;

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

function map(key_spec, value_spec) {
  const keyTest = specTest(key_spec);
  const valueTest = specTest(value_spec);
  const map = value => type.object(value)
    && Object.keys(value).every(key => keyTest(key) && valueTest(value[key]));
  map.verify = mapVerifyer(keyVerifyer(keyTest, key_spec), valueTest);
  return lazy(map, SPEC_NAME,
    () => `map(${specName(key_spec)}, ${specName(value_spec)})`);
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
