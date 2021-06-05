'use strict';

const { SPEC_NAME } = require('./spec-name');
const { failType } = require('./fail');

exports.verifyer = verifyer;

function verifyer(validator) {
  return (value, property) => {
    if (validator(value, property) === false) {
      failType(validator[SPEC_NAME], value, property);
    }
    return value;
  };
}
