'use strict';

const { failType } = require('./util');

exports.verifyer = verifyer;

function verifyer(validator) {
  return (value, options = {}, base = undefined) => {
    if (validator(value, base) === false) {
      failType(validator.toString(), value, base, options.error_code);
    }
    return value;
  };
}
