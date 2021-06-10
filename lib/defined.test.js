'use strict';

const { assert } = require('@sinonjs/referee-sinon');
const { schema } = require('..');
const { defined } = require('./defined');

describe('defined', () => {
  it('is exposed on schema', () => {
    assert.same(schema.defined, defined);
  });

  it('returns true for non-undefined values', () => {
    assert.isTrue(defined(true));
    assert.isTrue(defined(false));
    assert.isTrue(defined(0));
    assert.isTrue(defined(null));
    assert.isTrue(defined(''));
    assert.isTrue(defined({}));
  });

  it('returns false for undefined values', () => {
    assert.isFalse(defined(undefined));
  });

  context('verify', () => {
    it('returns the value for non-undefined values', () => {
      assert.isTrue(defined.verify(true));
      assert.isFalse(defined.verify(false));
      assert.isNull(defined.verify(null));
      assert.equals(defined.verify(''), '');
      assert.equals(defined.verify({}), {});
    });

    it('throws for undefined', () => {
      assert.exception(
        () => {
          defined.verify(undefined);
        },
        {
          name: 'TypeError',
          code: 'SCHEMA_VALIDATION',
          message: 'Expected defined but got undefined'
        }
      );
    });

    it('throws with given path in message', () => {
      assert.exception(
        () => {
          defined.verify(undefined, 'some.path');
        },
        {
          name: 'TypeError',
          code: 'SCHEMA_VALIDATION',
          message: 'Missing property "some.path"'
        }
      );
    });
  });
});
