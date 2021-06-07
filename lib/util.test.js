'use strict';

const { assert, refute, sinon } = require('@sinonjs/referee-sinon');
const { objectPath, arrayPath, raw, unwrap, assertType } = require('./util');

describe('util', () => {
  describe('objectPath', () => {
    it('returns key if parent is null', () => {
      const p = objectPath(null, 'key');

      assert.equals(p, 'key');
    });

    it('returns parent and key', () => {
      const p = objectPath('parent', 'key');

      assert.equals(p, 'parent.key');
    });
  });

  describe('arrayPath', () => {
    it('returns [index] if parent is null', () => {
      const p = arrayPath(null, 0);

      assert.equals(p, '[0]');
    });

    it('returns parent and [index]', () => {
      const p = arrayPath('parent', 1);

      assert.equals(p, 'parent[1]');
    });
  });

  describe('raw', () => {
    it('returns toJSON result of given value', () => {
      const expected = Symbol('toJSON result');
      const value = { toJSON: sinon.fake.returns(expected) };

      const result = raw(value);

      assert.same(result, expected);
    });

    it('throws if given object does not have a toJSON function', () => {
      assert.exception(
        () => {
          raw({});
        },
        {
          name: 'Error',
          message: 'Argument is not a schema reader or writer'
        }
      );
    });
  });

  describe('unwrap', () => {
    it('returns toJSON result of given value', () => {
      const expected = Symbol('toJSON result');
      const value = { toJSON: sinon.fake.returns(expected) };

      const result = unwrap(value);

      assert.same(result, expected);
    });

    it('returns give value if it does not have a toJSON function', () => {
      const value = Symbol('the value');

      const result = unwrap(value);

      assert.same(result, value);
    });
  });

  describe('assert-type', () => {
    it('does nothing if given value matches the type expectation', () => {
      refute.exception(() => {
        assertType({}, 'Object');
      });
      refute.exception(() => {
        assertType([], 'Array');
      });
    });

    it('throws if type does not match', () => {
      assert.exception(
        () => {
          assertType(null, 'Object');
        },
        {
          name: 'TypeError',
          code: 'SCHEMA_VALIDATION',
          message: 'Expected Object but got null'
        }
      );
    });

    it('throws if type does not match with base', () => {
      assert.exception(
        () => {
          assertType(null, 'Object', 'some.path');
        },
        {
          name: 'TypeError',
          code: 'SCHEMA_VALIDATION',
          message: 'Expected property "some.path" to be Object but got null'
        }
      );
    });
  });
});
