'use strict';

const { specName } = require('./spec-name');
const { specTest } = require('./spec-test');
const { validator } = require('./validator');

exports.one = one;

const { slice } = Array.prototype;

function one() {
  if (arguments.length < 2) {
    throw new Error('Require at least two arguments');
  }
  const specs = slice.call(arguments);
  const tests = specs.map(specTest);

  return validator(oneTester(tests), oneSpecName(specs));
}

function oneTester(tests) {
  return (value) => tests.some((test) => test(value));
}

function oneSpecName(specs) {
  return () => `one(${specs.map(specName).join(', ')})`;
}
