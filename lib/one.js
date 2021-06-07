'use strict';

const { specName } = require('./util');
const { lookup } = require('./registry');
const { validator } = require('./validator');

exports.one = one;

function one() {
  if (arguments.length < 2) {
    throw new Error('Require at least two arguments');
  }
  const tests = Array.prototype.map.call(arguments, lookup);

  return validator(oneTester(tests), oneSpecName(tests));
}

function oneTester(tests) {
  return (value) => tests.some((test) => test(value));
}

function oneSpecName(tests) {
  return () => `one(${tests.map(specName).join(', ')})`;
}
