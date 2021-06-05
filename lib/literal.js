'use strict';

const { stringify } = require('./stringify');
const { validator } = require('./validator');

exports.literal = literal;

const slice = Array.prototype.slice;

function literal() {
  if (arguments.length === 0) {
    throw new Error('Require at least one argument');
  }
  const values = slice.call(arguments);

  return validator(literalTester(values), literalSpecName(values));
}

function literalTester(values) {
  return (value) => values.some((v) => v === value);
}

function literalSpecName(values) {
  return () => `literal(${values.map(stringify).join(', ')})`;
}
