'use strict';

const { type } = require('./type');
const { objectPath } = require('./path');

exports.createItemGetter = createItemGetter;

function createItemGetter(valueTest, emitter, parent, read_write) {
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
    if (type.string(key) && !type.function(value) && type.defined(value)) {
      const factory = valueTest.verify && valueTest.verify[read_write];
      if (factory) {
        return (cache[key]
          || (cache[key] = factory(value, emitter, objectPath(parent, key))));
      }
    }
    return value;
  };
}
