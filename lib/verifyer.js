'use strict';

const { specName } = require('./spec-name');
const { stringify } = require('./stringify');
const { failSchemaValidation } = require('./fail');

exports.verifyer = verifyer;

function verifyer(fn, spec) {
  return (value, property) => {
    if (fn(value, property) === false) {
      const expectation = `${specName(spec)} but got ${stringify(value)}`;
      failSchemaValidation(new TypeError(property
        ? `Expected property "${property}" to be ${expectation}`
        : `Expected ${expectation}`));
    }
    return value;
  };
}
