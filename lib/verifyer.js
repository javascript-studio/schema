'use strict';

const { failType } = require('./util');

exports.verifyer = verifyer;

function verifyer(validator) {
  return (value, property) => {
    if (validator(value, property) === false) {
      failType(validator.toString(), value, property);
    }
    return value;
  };
}
