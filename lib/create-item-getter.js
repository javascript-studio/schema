'use strict';

const { objectPath } = require('./util');

exports.createItemGetter = createItemGetter;

function createItemGetter(valueTest, options, parent, read_write) {
  const cache = Object.create(null);
  return (target, key) => {
    if (key === 'toJSON') {
      return () => target;
    }
    const value = Reflect.get(target, key);
    if (key === 'length') {
      return value;
    }
    // Key might be Symbol and value a prototype function:
    if (
      typeof key === 'string' &&
      typeof value !== 'undefined' &&
      typeof value !== 'function'
    ) {
      const factory = valueTest.verify && valueTest.verify[read_write];
      if (factory) {
        return (
          cache[key] ||
          (cache[key] = factory(value, options, objectPath(parent, key)))
        );
      }
    }
    return value;
  };
}
