'use strict';

const { typeOf, failSpec } = require('./util');
const { validator } = require('./validator');
const { literal } = require('./literal');

exports.lookup = lookup;
exports.registerType = registerType;
exports.registerValue = registerValue;

const by_value = new Map();
const by_type = {
  Null: literal,
  RegExp: regexp,
  Function: func
};

function lookup(spec) {
  return by_value.get(spec) || (by_type[typeOf(spec)] || failSpec)(spec);
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

function registerType(type, handler) {
  by_type[type] = handler;
}

function registerValue(value, handler) {
  by_value.set(value, handler);
}
