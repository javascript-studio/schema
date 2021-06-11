'use strict';

const { lookup } = require('./registry');
const { validator } = require('./validator');

exports.opt = opt;

function opt(spec) {
  const test = lookup(spec);

  return validator(optTester(test), optSpecName(test), optVerifyer(test));
}

function optTester(test) {
  return (value) => value === undefined || test(value);
}

function optSpecName(test) {
  return () => `undefined or ${test}`;
}

function optVerifyer(test) {
  return (value, options = {}, base = undefined) =>
    value === undefined ? value : test.verify(value, options, base);
}
