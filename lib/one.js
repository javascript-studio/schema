'use strict';

const { lookup } = require('./registry');
const { validator } = require('./validator');
const { verifyer } = require('./verifyer');
const { lazy } = require('./util');

exports.one = one;

function one() {
  if (arguments.length < 2) {
    throw new Error('Require at least two arguments');
  }
  const tests = Array.prototype.map.call(arguments, (spec) => lookup(spec));

  const tester = oneTester(tests);
  return validator(tester, oneSpecName(tests), oneVerifyer(tester, tests));
}

function oneTester(tests) {
  return (value) => tests.some((test) => test(value));
}

function oneSpecName(tests) {
  return () => `one(${tests.join(', ')})`;
}

function oneVerifyer(tester, tests) {
  const verify = verifyer(tester, tests);
  lazy(verify, 'read', () => createOneReaderWriter(verify, tests, 'read'));
  lazy(verify, 'write', () => createOneReaderWriter(verify, tests, 'write'));
  return verify;
}

function createOneReaderWriter(verify, tests, method) {
  return (value, options = {}, base = undefined) => {
    verify(value);
    for (const test of tests) {
      const readOrWrite = test.verify[method];
      if (readOrWrite) {
        try {
          return readOrWrite(value, options, base);
        } catch (ignore) {
          // Continue loop
        }
      }
    }
    return undefined;
  };
}
