'use strict';

const { specName } = require('./util');
const { lookup } = require('./spec-test');
const { validator } = require('./validator');

exports.opt = opt;

function opt(spec) {
  const test = lookup(spec);

  return validator(optTester(test), optSpecName(test));
}

function optTester(test) {
  return (value) => value === undefined || test(value);
}

function optSpecName(test) {
  return () => `opt(${specName(test)})`;
}
