'use strict';

const { SPEC_NAME } = require('./spec-name');
const { stringify } = require('./stringify');
const { failSchemaValidation } = require('./fail');

exports.verifyer = verifyer;

function verifyer(validator) {
  return (value, property) => {
    if (validator(value, property) === false) {
      const expectation = `${
        validator[SPEC_NAME] || 'custom value'
      } but got ${stringify(value)}`;
      failSchemaValidation(
        new TypeError(
          property
            ? `Expected property "${property}" to be ${expectation}`
            : `Expected ${expectation}`
        )
      );
    }
    return value;
  };
}
