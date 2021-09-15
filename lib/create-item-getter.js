'use strict';

exports.createItemGetter = createItemGetter;

function createItemGetter(
  cache,
  valueTest,
  options,
  parent,
  read_write,
  makePath
) {
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
          (cache[key] = factory(value, options, makePath(parent, key)))
        );
      }
    }
    return value;
  };
}
