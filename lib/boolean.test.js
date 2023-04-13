'use strict';

const { assert } = require('@sinonjs/referee-sinon');
const { schema } = require('..');
const { boolean } = require('./boolean');

describe('boolean', () => {
  it('is exposed on schema', () => {
    assert.same(schema.boolean, boolean);
  });

  it('returns true for boolean values', () => {
    assert.isTrue(boolean(true));
    assert.isTrue(boolean(false));
  });

  it('returns false for non-boolean values', () => {
    // @ts-expect-error
    assert.isFalse(boolean(undefined));
    // @ts-expect-error
    assert.isFalse(boolean(null));
    // @ts-expect-error
    assert.isFalse(boolean(0));
    // @ts-expect-error
    assert.isFalse(boolean(1));
    // @ts-expect-error
    assert.isFalse(boolean(''));
    // @ts-expect-error
    assert.isFalse(boolean('test'));
    // @ts-expect-error
    assert.isFalse(boolean({}));
    // @ts-expect-error
    assert.isFalse(boolean([]));
  });

  it('has type "boolean"', () => {
    assert.equals(boolean.type, 'boolean');
  });

  context('verify', () => {
    it('returns the value for boolean values', () => {
      assert.isTrue(boolean.verify(true));
      assert.isFalse(boolean.verify(false));
    });

    it('throws for non boolean values', () => {
      assert.exception(
        () => {
          // @ts-expect-error
          boolean.verify(0);
        },
        {
          name: 'TypeError',
          code: 'E_SCHEMA',
          message: 'Expected boolean but got 0'
        }
      );
      assert.exception(
        () => {
          // @ts-expect-error
          boolean.verify('test');
        },
        {
          name: 'TypeError',
          code: 'E_SCHEMA',
          message: 'Expected boolean but got "test"'
        }
      );
    });

    it('throws with given path in message', () => {
      assert.exception(
        () => {
          // @ts-expect-error
          boolean.verify(null, {}, 'some.path');
        },
        {
          name: 'TypeError',
          code: 'E_SCHEMA',
          message: 'Expected property "some.path" to be boolean but got null'
        }
      );
    });

    it('throws with given error code', () => {
      assert.exception(
        () => {
          // @ts-expect-error
          boolean.verify(null, { error_code: 'INVALID' });
        },
        {
          code: 'INVALID'
        }
      );
    });
  });
});
