'use strict';

const { SPEC_NAME, CUSTOM_VALIDATOR } = require('./constants');
const { lazy } = require('./util');
const { verifyer } = require('./verifyer');

exports.validator = validator;

function validator(test, specName, verify = verifyer(test)) {
  if (typeof specName === 'function') {
    lazy(test, SPEC_NAME, specName);
  } else {
    test[SPEC_NAME] = specName || CUSTOM_VALIDATOR;
  }
  test.verify = verify;
  return test;
}
