'use strict';

const { CUSTOM_VALIDATOR } = require('./constants');
const { verifyer } = require('./verifyer');

exports.validator = validator;

function validator(test, toString, verify = verifyer(test)) {
  if (typeof toString === 'function') {
    test.toString = toString;
  } else {
    test.toString = () => toString || CUSTOM_VALIDATOR;
  }
  test.verify = verify;
  return test;
}
