'use strict';

const { lazy } = require('./lazy');
const { specName, SPEC_NAME } = require('./spec-name');
const { specTest } = require('./spec-test');

exports.opt = opt;

function opt(spec) {
  const test = specTest(spec);

  const optTest = optTester(test);
  lazy(optTest, SPEC_NAME, () => `opt(${specName(spec)})`);

  return optTest;
}

function optTester(test) {
  return (value) => value === undefined || test(value);
}
