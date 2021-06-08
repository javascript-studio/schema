'use strict';

const { lookup } = require('./registry');
const { validator } = require('./validator');

exports.all = all;

function all() {
  if (arguments.length < 2) {
    throw new Error('Require at least two arguments');
  }
  const tests = Array.prototype.map.call(arguments, lookup);

  return validator(allTester(tests), allSpecName(tests));
}

function allTester(tests) {
  return (value) => tests.every((test) => test(value));
}

function allSpecName(tests) {
  return () => `all(${tests.join(', ')})`;
}
