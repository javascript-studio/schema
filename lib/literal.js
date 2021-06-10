'use strict';

const { stringify } = require('./util');
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
  return () => {
    const mapped = values.map(stringify);
    if (mapped.length === 1) {
      return mapped[0];
    }
    const last = mapped.length - 1;
    return `${mapped.slice(0, last).join(', ')} or ${mapped.slice(last)}`;
  };
}
