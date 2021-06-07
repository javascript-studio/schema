'use strict';

const { CUSTOM_VALIDATOR } = require('./constants');
const SPEC_NAME = Symbol('spec_name');

exports.SPEC_NAME = SPEC_NAME;
exports.specName = specName;

function specName(spec) {
  return spec[SPEC_NAME] || CUSTOM_VALIDATOR;
}
