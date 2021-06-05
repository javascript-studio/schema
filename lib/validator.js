'use strict';

const { lazy } = require('./lazy');
const { SPEC_NAME } = require('./spec-name');
const { verifyer } = require('./verifyer');

exports.validator = validator;

function validator(test, specName, verify) {
  if (typeof specName === 'function') {
    lazy(test, SPEC_NAME, specName);
  } else {
    test[SPEC_NAME] = specName;
  }
  test.verify = verify || verifyer(test);
  return test;
}
