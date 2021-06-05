'use strict';

const { CUSTOM_VALIDATOR } = require('./constants');
const { typeOf } = require('./type-of');
const SPEC_NAME = Symbol('spec_name');

exports.SPEC_NAME = SPEC_NAME;
exports.specName = specName;

const spec_name = {
  Function: (spec) => spec[SPEC_NAME] || CUSTOM_VALIDATOR,
  Object: (spec) => {
    const p = Object.keys(spec).map((key) => `${key}:${specName(spec[key])}`);
    return `{${p.join(', ')}}`;
  },
  Array: (spec) => `[${spec.map(specName).join(', ')}]`
};

function specName(spec) {
  return (spec_name[typeOf(spec)] || String)(spec);
}
