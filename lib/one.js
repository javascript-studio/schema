'use strict';

const { lookup } = require('./registry');
const { validator } = require('./validator');
const { verifyer } = require('./verifyer');
const { lazy, failType } = require('./util');

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
  return () => specName(tests);
}

function oneVerifyer(tester, tests) {
  const verify = verifyer(tester, tests);
  lazy(verify, 'read', () => createOneReaderWriter(tests, 'read'));
  lazy(verify, 'write', () => createOneReaderWriter(tests, 'write'));
  return verify;
}

function createOneReaderWriter(tests, method) {
  return (value, options = {}, base = undefined) => {
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
    failType(specName(tests), value, base, options.error_code);
    return null; // make eslint happy
  };
}

function specName(tests) {
  return `one(${tests.join(', ')})`;
}
