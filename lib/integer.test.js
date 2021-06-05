'use strict';

const { assert } = require('@sinonjs/referee-sinon');
const { schema } = require('./schema');
const { integer } = require('./integer');

describe('integer', () => {
  it('is exposed on schema', () => {
    assert.same(schema.integer, integer);
  });

  it('returns true for integer values', () => {
    assert.isTrue(integer(0));
    assert.isTrue(integer(1));
    assert.isTrue(integer(42));
    assert.isTrue(integer(-1));
  });

  it('returns false for non-integer values', () => {
    assert.isFalse(integer(undefined));
    assert.isFalse(integer(null));
    assert.isFalse(integer(false));
    assert.isFalse(integer(0.5));
    assert.isFalse(integer(-0.5));
    assert.isFalse(integer(''));
    assert.isFalse(integer('test'));
    assert.isFalse(integer({}));
    assert.isFalse(integer([]));
  });

  it('returns false for non-finite number values', () => {
    assert.isFalse(integer(NaN));
    assert.isFalse(integer(Infinity));
    assert.isFalse(integer(-Infinity));
  });

  context('verify', () => {
    it('returns the value for number values', () => {
      assert.equals(integer.verify(0), 0);
      assert.equals(integer.verify(-1), -1);
      assert.equals(integer.verify(42), 42);
    });

    it('throws for non number values', () => {
      assert.exception(
        () => {
          integer.verify(false);
        },
        {
          name: 'TypeError',
          code: 'SCHEMA_VALIDATION',
          message: 'Expected integer but got false'
        }
      );
      assert.exception(
        () => {
          integer.verify('test');
        },
        {
          name: 'TypeError',
          code: 'SCHEMA_VALIDATION',
          message: 'Expected integer but got "test"'
        }
      );
      assert.exception(
        () => {
          integer.verify(0.5);
        },
        {
          name: 'TypeError',
          code: 'SCHEMA_VALIDATION',
          message: 'Expected integer but got 0.5'
        }
      );
      assert.exception(
        () => {
          integer.verify(NaN);
        },
        {
          name: 'TypeError',
          code: 'SCHEMA_VALIDATION',
          message: 'Expected integer but got NaN'
        }
      );
    });

    it('throws with given path in message', () => {
      assert.exception(
        () => {
          integer.verify(null, 'some.path');
        },
        {
          name: 'TypeError',
          code: 'SCHEMA_VALIDATION',
          message: 'Expected property "some.path" to be integer but got null'
        }
      );
    });
  });
});
