'use strict';

const { stringify } = require('./util');
const { validator } = require('./validator');

/**
 * @typedef {import('./verifyer').SchemaLiteral} SchemaLiteral
 */
/**
 * @template {SchemaLiteral} L
 * @typedef {import('./verifyer').Tester<L>} LiteralTester
 */

exports.literal = literal;

/**
 * @template {SchemaLiteral[]} L
 * @typedef LiteralProps
 * @property {'literal'} type
 * @property {Readonly<L>} values
 */
/**
 * @template {SchemaLiteral[]} L
 * @typedef {import('./validator').Validator<L[number]> & LiteralProps<L>} LiteralValidator
 */

/**
 * @template {SchemaLiteral[]} L
 * @param {L} values
 * @returns {LiteralValidator<L>}
 */
function literal(...values) {
  if (values.length === 0) {
    throw new Error('Require at least one argument');
  }

  const readonly_values = /** @type {Readonly<L>} */ (
    Object.freeze(Array.prototype.slice.call(values))
  );

  const test = /** @type {LiteralValidator<L>} */ (
    validator(
      literalTester(readonly_values),
      literalValidatorName(readonly_values)
    )
  );
  test.type = 'literal';
  test.values = readonly_values;
  return test;
}

/**
 * @template {SchemaLiteral[]} L
 * @param {Readonly<L>} values
 * @returns {LiteralTester<L[number]>}
 */
function literalTester(values) {
  return (value) => values.some((v) => v === value);
}

/**
 * @param {Readonly<SchemaLiteral[]>} values
 * @returns {'null' | (() => string)}
 */
function literalValidatorName(values) {
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
