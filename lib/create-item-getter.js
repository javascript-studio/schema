'use strict';

exports.createItemGetter = createItemGetter;

function createItemGetter(valueTest, options, parent, read_write, makePath) {
  const cache = new WeakMap();
  return (target, key) => {
    if (key === 'toJSON') {
      return () => target;
    }
    const value = Reflect.get(target, key);
    // Key might be Symbol and value a prototype function:
    if (
      key === 'length' ||
      value === null ||
      typeof key !== 'string' ||
      typeof value !== 'object'
    ) {
      return value;
    }
    const factory = valueTest.verify && valueTest.verify[read_write];
    if (!factory) {
      return value;
    }
    if (cache.has(value)) {
      return cache.get(value);
    }
    const proxy = factory(value, options, makePath(parent, key));
    cache.set(value, proxy);
    return proxy;
  };
}
