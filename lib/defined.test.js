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
    // @ts-expect-error
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
          // @ts-expect-error
          defined.verify(undefined);
        },
        {
          name: 'TypeError',
          code: 'E_SCHEMA',
          message: 'Expected defined but got undefined'
        }
      );
    });

    it('throws with given path in message', () => {
      assert.exception(
        () => {
          // @ts-expect-error
          defined.verify(undefined, {}, 'some.path');
        },
        {
          name: 'TypeError',
          code: 'E_SCHEMA',
          message: 'Missing property "some.path"'
        }
      );
    });

    it('throws with given error code', () => {
      assert.exception(
        () => {
          // @ts-expect-error
          defined.verify(undefined, { error_code: 'INVALID' });
        },
        {
          code: 'INVALID'
        }
      );
    });
  });
});
