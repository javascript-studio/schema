'use strict';

const { typeOf, failSpec } = require('./util');
const { validator } = require('./validator');
const { literal } = require('./literal');

exports.specTest = specTest;
exports.registerSpecType = registerSpecType;

const spec_type = {
  Null: literal,
  RegExp: regexp,
  Function: func
};

function specTest(spec) {
  return (spec_type[typeOf(spec)] || failSpec)(spec);
}

function func(spec) {
  return spec.verify ? spec : validator(spec.bind(), spec.name);
}

function regexp(spec) {
  const regexpTest = regexpTester(spec);

  return validator(regexpTest, String(spec));
}

function regexpTester(spec) {
  return (value) => typeof value === 'string' && spec.test(value);
}

function registerSpecType(type, handler) {
  spec_type[type] = handler;
}
