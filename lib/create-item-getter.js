'use strict';

const { objectPath } = require('./path');

exports.createItemGetter = createItemGetter;

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
          || (cache[key] = factory(value, emitter, objectPath(parent, key))));
      }
    }
    return value;
  };
}
