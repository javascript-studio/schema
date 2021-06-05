'use strict';

const { assert } = require('@sinonjs/referee-sinon');
const { schema } = require('..');
const { number } = require('./number');

describe('number', () => {
  it('is exposed on schema', () => {
    assert.same(schema.number, number);
  });

  it('returns true for number values', () => {
    assert.isTrue(number(0));
    assert.isTrue(number(0.5));
    assert.isTrue(number(1));
    assert.isTrue(number(42));
    assert.isTrue(number(-0.5));
    assert.isTrue(number(-1));
  });

  it('returns false for non-number values', () => {
    assert.isFalse(number(undefined));
    assert.isFalse(number(null));
    assert.isFalse(number(false));
    assert.isFalse(number(''));
    assert.isFalse(number('test'));
    assert.isFalse(number({}));
    assert.isFalse(number([]));
  });

  it('returns false for non-finite number values', () => {
    assert.isFalse(number(NaN));
    assert.isFalse(number(Infinity));
    assert.isFalse(number(-Infinity));
  });

  context('verify', () => {
    it('returns the value for number values', () => {
      assert.equals(number.verify(0), 0);
      assert.equals(number.verify(0.5), 0.5);
      assert.equals(number.verify(-1), -1);
      assert.equals(number.verify(42), 42);
    });

    it('throws for non number values', () => {
      assert.exception(
        () => {
          number.verify(false);
        },
        {
          name: 'TypeError',
          code: 'SCHEMA_VALIDATION',
          message: 'Expected number but got false'
        }
      );
      assert.exception(
        () => {
          number.verify('test');
        },
        {
          name: 'TypeError',
          code: 'SCHEMA_VALIDATION',
          message: 'Expected number but got "test"'
        }
      );
      assert.exception(
        () => {
          number.verify(NaN);
        },
        {
          name: 'TypeError',
          code: 'SCHEMA_VALIDATION',
          message: 'Expected number but got NaN'
        }
      );
    });

    it('throws with given path in message', () => {
      assert.exception(
        () => {
          number.verify(null, 'some.path');
        },
        {
          name: 'TypeError',
          code: 'SCHEMA_VALIDATION',
          message: 'Expected property "some.path" to be number but got null'
        }
      );
    });
  });
});
