'use strict';

const { lookup } = require('./registry');
const { validator } = require('./validator');
const { copyPropertyDescriptor, copyTypeAndProperties } = require('./util');

exports.opt = opt;

function opt(spec) {
  const test = lookup(spec);

  const wrapped = validator(
    optTester(test),
    optSpecName(test),
    optVerifyer(test)
  );
  wrapped.optional = true;
  copyTypeAndProperties(test, wrapped);
  return wrapped;
}

function optTester(test) {
  return (value) => value === undefined || test(value);
}

function optSpecName(test) {
  return () => `undefined or ${test}`;
}

function optVerifyer(test) {
  const verify = (value, options = {}, base = undefined) =>
    value === undefined ? value : test.verify(value, options, base);
  copyPropertyDescriptor(test.verify, 'read', verify);
  copyPropertyDescriptor(test.verify, 'write', verify);
  return verify;
}
