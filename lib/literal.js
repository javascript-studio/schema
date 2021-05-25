'use strict';

const { lazy } = require('./lazy');
const { stringify } = require('./stringify');
const { SPEC_NAME } = require('./spec-name');

exports.literal = literal;

const slice = Array.prototype.slice;

function literal() {
  if (arguments.length === 0) {
    throw new Error('Require at least one argument');
  }
  const values = slice.call(arguments);

  const literalTest = literalTester(values);
  lazy(literalTest, SPEC_NAME,
    () => `literal(${values.map(stringify).join(', ')})`);

  return literalTest;
}

function literalTester(values) {
  return (value) => values.some(v => v === value);
}
