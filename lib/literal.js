'use strict';

const { stringify } = require('./stringify');
const { validator } = require('./validator');

exports.literal = literal;

function literal() {
  if (arguments.length === 0) {
    throw new Error('Require at least one argument');
  }
  const values = Array.prototype.slice.call(arguments);

  return validator(literalTester(values), literalSpecName(values));
}

function literalTester(values) {
  return (value) => values.some((v) => v === value);
}

function literalSpecName(values) {
  if (values.length === 1 && values[0] === null) {
    return 'null';
  }
  return () => `literal(${values.map(stringify).join(', ')})`;
}
