'use strict';

const { specName } = require('./spec-name');
const { specTest } = require('./spec-test');
const { validator } = require('./validator');

exports.opt = opt;

function opt(spec) {
  const test = specTest(spec);

  return validator(optTester(test), optSpecName(test));
}

function optTester(test) {
  return (value) => value === undefined || test(value);
}

function optSpecName(test) {
  return () => `opt(${specName(test)})`;
}
