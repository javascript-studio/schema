'use strict';

const { typeOf, failSpec } = require('./util');
const { validator } = require('./validator');
const { literal } = require('./literal');

exports.lookup = lookup;
exports.registerSpecType = registerSpecType;

const spec_type = {
  Null: literal,
  RegExp: regexp,
  Function: func
};

function lookup(spec) {
  return (spec_type[typeOf(spec)] || failSpec)(spec);
}

function func(spec) {
  return spec.verify ? spec : validator(spec.bind(), spec.name);
}

function regexp(spec) {
  return validator(
    (value) => typeof value === 'string' && spec.test(value),
    String(spec)
  );
}

function registerSpecType(type, handler) {
  spec_type[type] = handler;
}
