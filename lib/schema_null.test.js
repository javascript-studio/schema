'use strict';

const { assert, refute } = require('@sinonjs/referee-sinon');
const { schema } = require('..');

describe('schema null', () => {
  it('validates null', () => {
    const nullSchema = schema({ test: null });

    refute.exception(() => {
      nullSchema({ test: null });
    });
    assert.exception(
      () => {
        nullSchema({ test: undefined });
      },
      {
        name: 'TypeError',
        message:
          'Expected property "test" to be literal(null) but got undefined',
        code: 'SCHEMA_VALIDATION'
      }
    );
    assert.exception(
      () => {
        nullSchema({ test: 'test' });
      },
      {
        name: 'TypeError',
        message: 'Expected property "test" to be literal(null) but got "test"',
        code: 'SCHEMA_VALIDATION'
      }
    );
  });

  it('returns given object', () => {
    const nullSchema = schema({ test: null });
    const object = { test: null };

    const returned = nullSchema(object);

    assert.same(returned, object);
  });
});
