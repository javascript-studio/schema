'use strict';

exports.lazy = lazy;

function lazy(object, property, factory) {
  let cache;
  Object.defineProperty(object, property, {
    get: () => cache || (cache = factory())
  });
}
