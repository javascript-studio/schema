'use strict';

const { assert, refute } = require('@sinonjs/referee-sinon');
const { schema } = require('..');

describe('schema null', () => {
  const nullSchema = schema({ test: null });

  it('validates null', () => {
    refute.exception(() => {
      nullSchema({ test: null });
    });
    assert.exception(
      () => {
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
        nullSchema({ test: 'test' }, { error_code: 'INVALID' });
      },
      {
        code: 'INVALID'
      }
    );
  });

  it('returns given object', () => {
    const object = { test: null };

    const returned = nullSchema(object);

    assert.same(returned, object);
  });
});
