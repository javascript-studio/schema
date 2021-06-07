'use strict';

const { SPEC_NAME, CUSTOM_VALIDATOR } = require('./constants');

exports.specName = specName;

function specName(spec) {
  return spec[SPEC_NAME] || CUSTOM_VALIDATOR;
}
