'use strict';

const { assert, refute } = require('@sinonjs/referee-sinon');
const { schema, string, object } = require('..');

describe('schema regexp', () => {
  it('requires a string', () => {
    const regexpSchema = schema(object({ test: string.regexp(/[0-9]/) }));

    refute.exception(() => {
      regexpSchema({ test: '7' });
    });
    refute.exception(() => {
      regexpSchema({ test: 'some 7' });
    });
    assert.exception(
      () => {
        // @ts-expect-error
        regexpSchema({ test: undefined });
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
        regexpSchema({ test: 7 });
      },
      {
        name: 'TypeError',
        message:
          'Expected property "test" to be string matching /[0-9]/ but got 7',
        code: 'E_SCHEMA'
      }
    );
  });

  it('requires the string to match the regular expression', () => {
    const regexpSchema = schema(object({ test: string.regexp(/[0-9]/) }));

    assert.exception(
      () => {
        regexpSchema({ test: 'foo' });
      },
      {
        name: 'TypeError',
        message:
          'Expected property "test" to be string matching /[0-9]/ but got "foo"',
        code: 'E_SCHEMA'
      }
    );
  });
});
