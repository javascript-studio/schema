'use strict';

const { specName } = require('./spec-name');
const { specTest } = require('./spec-test');
const { validator } = require('./validator');

exports.opt = opt;

function opt(spec) {
  const test = specTest(spec);

  return validator(optTester(test), optSpecName(spec));
}

function optTester(test) {
  return (value) => value === undefined || test(value);
}

function optSpecName(spec) {
  return () => `opt(${specName(spec)})`;
}
