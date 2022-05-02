'use strict';

const { typeOf, failSpec } = require('./util');
const { validator } = require('./validator');
const { literal } = require('./literal');
const { string } = require('./string');

exports.lookup = lookup;
exports.registerType = registerType;
exports.registerValue = registerValue;

const by_value = new Map();
const by_type = {
  Null: () => literal(null),
  RegExp: string.regexp,
  Function: func
};

function lookup(spec, spec_options = {}) {
  return (
    by_value.get(spec) ||
    (by_type[typeOf(spec)] || failSpec)(spec, spec_options)
  );
}

function func(spec, spec_options) {
  if (spec.verify) {
    if (spec.spec) {
      return lookup(spec.spec, spec_options);
    }
    return spec;
  }
  return validator(spec.bind(), spec.name);
}

function registerType(type, handler) {
  by_type[type] = handler;
}

function registerValue(value, handler) {
  by_value.set(value, handler);
}
