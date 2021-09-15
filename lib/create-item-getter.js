'use strict';

exports.createItemGetter = createItemGetter;

function createItemGetter(valueTest, options, parent, read_write, makePath) {
  const cache = new WeakMap();
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
        if (cache.has(value)) {
          return cache.get(value);
        }
        const proxy = factory(value, options, makePath(parent, key));
        cache.set(value, proxy);
        return proxy;
      }
    }
    return value;
  };
}
