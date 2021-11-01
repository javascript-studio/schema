'use strict';

const { lookup } = require('./registry');
const { validator } = require('./validator');
const { verifyer } = require('./verifyer');
const { lazy } = require('./util');

exports.all = all;

function all() {
  if (arguments.length < 2) {
    throw new Error('Require at least two arguments');
  }
  const tests = Array.prototype.map.call(arguments, (spec) => lookup(spec));

  const tester = allTester(tests);
  return validator(tester, allSpecName(tests), allVerifyer(tester, tests));
}

function allTester(tests) {
  return (value) => tests.every((test) => test(value));
}

function allSpecName(tests) {
  return () => `all(${tests.join(', ')})`;
}

function allVerifyer(tester, tests) {
  const verify = verifyer(tester, tests);
  lazy(verify, 'read', () => createAllReaderWriter(tester, tests, 'read'));
  lazy(verify, 'write', () => createAllReaderWriter(tester, tests, 'write'));
  return verify;
}

function createAllReaderWriter(tester, tests, method) {
  return (value, options = {}, base = undefined) => {
    tester.verify(value);
    for (const test of tests) {
      const readOrWrite = test.verify[method];
      if (readOrWrite) {
        return readOrWrite(value, options, base);
      }
    }
    return undefined;
  };
}
