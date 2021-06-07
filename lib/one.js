'use strict';

const { specName } = require('./util');
const { specTest } = require('./spec-test');
const { validator } = require('./validator');

exports.one = one;

function one() {
  if (arguments.length < 2) {
    throw new Error('Require at least two arguments');
  }
  const tests = Array.prototype.map.call(arguments, specTest);

  return validator(oneTester(tests), oneSpecName(tests));
}

function oneTester(tests) {
  return (value) => tests.some((test) => test(value));
}

function oneSpecName(tests) {
  return () => `one(${tests.map(specName).join(', ')})`;
}
