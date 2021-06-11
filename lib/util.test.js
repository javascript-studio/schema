'use strict';

const { assert, refute, sinon } = require('@sinonjs/referee-sinon');
const {
  objectPath,
  arrayPath,
  raw,
  unwrap,
  assertType,
  lazy,
  typeOf,
  stringify
} = require('./util');

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
          code: 'E_SCHEMA',
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
          code: 'E_SCHEMA',
          message: 'Expected property "some.path" to be Object but got null'
        }
      );
    });

    it('throws with the given code', () => {
      assert.exception(
        () => {
          assertType(null, 'Object', null, 'INVALID');
        },
        {
          code: 'INVALID'
        }
      );
    });

    it('throws with the given code if base is defined and value is not', () => {
      assert.exception(
        () => {
          assertType(undefined, 'Object', 'base', 'INVALID');
        },
        {
          code: 'INVALID'
        }
      );
    });
  });

  describe('lazy', () => {
    it('invokes given factory once', () => {
      const factory = sinon.fake(() => ({ some: 'object' }));
      const object = {};

      lazy(object, 'test', factory);

      const result_1 = object.test;
      const result_2 = object.test;

      assert.calledOnce(factory);
      assert.same(result_1, result_2);
    });
  });

  describe('typeOf', () => {
    it('returns Object for object', () => {
      const type = typeOf({});

      assert.equals(type, 'Object');
    });

    it('returns Function for function', () => {
      const type = typeOf(() => {});

      assert.equals(type, 'Function');
    });

    it('returns Array for array', () => {
      const type = typeOf([]);

      assert.equals(type, 'Array');
    });

    it('returns Arguments for arguments', () => {
      const type = typeOf(arguments);

      assert.equals(type, 'Arguments');
    });

    it('returns Number for number', () => {
      const type = typeOf(42);

      assert.equals(type, 'Number');
    });

    it('returns RegExp for regexp', () => {
      const type = typeOf(/[a-z]/);

      assert.equals(type, 'RegExp');
    });
  });

  describe('stringify', () => {
    it('returns object as JSON string', () => {
      const type = stringify({ key: 'value' });

      assert.equals(type, '{"key":"value"}');
    });

    it('returns "function" for function', () => {
      const type = stringify(() => {});

      assert.equals(type, 'function');
    });

    it('returns array as JSON string', () => {
      const type = stringify(['test', 42, { key: 'value' }]);

      assert.equals(type, '["test",42,{"key":"value"}]');
    });

    it('returns "[object Arguments]" for arguments', () => {
      const type = stringify(arguments);

      assert.equals(type, '[object Arguments]');
    });

    it('returns string as quoted string', () => {
      const type = stringify('test "with quotes"');

      assert.equals(type, '"test \\"with quotes\\""');
    });

    it('returns number as string', () => {
      const type = stringify(42);

      assert.equals(type, '42');
    });

    it('returns NaN as string', () => {
      const type = stringify(NaN);

      assert.equals(type, 'NaN');
    });

    it('returns Infinity as string', () => {
      const type = stringify(Infinity);

      assert.equals(type, 'Infinity');
    });

    it('returns regexp as string', () => {
      const type = stringify(/[a-z]/i);

      assert.equals(type, '/[a-z]/i');
    });
  });
});
