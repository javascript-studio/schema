'use strict';

const { assert } = require('@sinonjs/referee-sinon');
const { schema } = require('..');
const { string } = require('./string');

describe('string', () => {
  it('is exposed on schema', () => {
    assert.same(schema.string, string);
  });

  it('returns true for string values', () => {
    assert.isTrue(string(''));
    assert.isTrue(string('test'));
  });

  it('returns false for non-string values', () => {
    assert.isFalse(string(undefined));
    assert.isFalse(string(null));
    assert.isFalse(string(0));
    assert.isFalse(string(1));
    assert.isFalse(string(true));
    assert.isFalse(string({}));
    assert.isFalse(string([]));
  });

  context('verify', () => {
    it('returns the value for string values', () => {
      assert.equals(string.verify(''), '');
      assert.equals(string.verify('test'), 'test');
    });

    it('throws for non string values', () => {
      assert.exception(
        () => {
          string.verify(0);
        },
        {
          name: 'TypeError',
          code: 'SCHEMA_VALIDATION',
          message: 'Expected string but got 0'
        }
      );
      assert.exception(
        () => {
          string.verify(false);
        },
        {
          name: 'TypeError',
          code: 'SCHEMA_VALIDATION',
          message: 'Expected string but got false'
        }
      );
    });

    it('throws with given path in message', () => {
      assert.exception(
        () => {
          string.verify(null, 'some.path');
        },
        {
          name: 'TypeError',
          code: 'SCHEMA_VALIDATION',
          message: 'Expected property "some.path" to be string but got null'
        }
      );
    });
  });
});
