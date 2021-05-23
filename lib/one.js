'use strict';

const { lazy } = require('./lazy');
const { specName, SPEC_NAME } = require('./spec-name');
const { specTest } = require('./spec-test');

exports.one = one;

const slice = Array.prototype.slice;

function one() {
  if (arguments.length < 2) {
    throw new Error('Require at least two arguments');
  }
  const specs = slice.call(arguments);
  const tests = specs.map(specTest);
  const test = value => tests.some(test => test(value));
  return lazy(test, SPEC_NAME, () => `one(${specs.map(specName).join(', ')})`);
}