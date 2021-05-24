'use strict';

const { typeOf } = require('./type-of');
const SPEC_NAME = Symbol('spec_name');

exports.SPEC_NAME = SPEC_NAME;
exports.specName = specName;

const spec_name = {
  Function: (spec) => spec[SPEC_NAME] || 'custom value',
  Object: (spec) => {
    const p = Object.keys(spec).map(key => `${key}:${specName(spec[key])}`);
    return `{${p.join(', ')}}`;
  }
};

function specName(spec) {
  return (spec_name[typeOf(spec)] || String)(spec);
}
