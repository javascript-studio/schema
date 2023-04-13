'use strict';

const { assert, refute } = require('@sinonjs/referee-sinon');
const { schema, literal, object } = require('..');

describe('schema null', () => {
  const nullSchema = schema(object({ test: literal(null) }));

  it('validates null', () => {
    refute.exception(() => {
      nullSchema({ test: null });
    });
    assert.exception(
      () => {
        // @ts-expect-error
        nullSchema({ test: undefined });
      },
      {
        name: 'TypeError',
        message: 'Missing property "test"',
        code: 'E_SCHEMA'
      }
    );
    assert.exception(
      () => {
        // @ts-expect-error
        nullSchema({ test: 'test' });
      },
      {
        name: 'TypeError',
        message: 'Expected property "test" to be null but got "test"',
        code: 'E_SCHEMA'
      }
    );
  });

  it('fails with given error code', () => {
    assert.exception(
      () => {
        // @ts-expect-error
        nullSchema({ test: 'test' }, { error_code: 'INVALID' });
      },
      {
        code: 'INVALID'
      }
    );
  });

  it('returns given object', () => {
    const obj = { test: null };

    const returned = nullSchema(obj);

    assert.same(returned, obj);
  });
});
