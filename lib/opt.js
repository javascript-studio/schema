'use strict';

const { lazy } = require('./lazy');
const { specName, SPEC_NAME } = require('./spec-name');
const { specTest } = require('./spec-test');

exports.opt = opt;

function opt(spec) {
  const test = specTest(spec);
  const opt = value => value === undefined || test(value);
  return lazy(opt, SPEC_NAME, () => `opt(${specName(spec)})`);
}
