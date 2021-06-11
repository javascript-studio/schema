'use strict';

const { assert, refute } = require('@sinonjs/referee-sinon');
const { schema } = require('..');

describe('schema regexp', () => {
  it('requires a string', () => {
    const regexpSchema = schema({ test: /[0-9]/ });

    refute.exception(() => {
      regexpSchema({ test: '7' });
    });
    refute.exception(() => {
      regexpSchema({ test: 'some 7' });
    });
    assert.exception(
      () => {
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
        regexpSchema({ test: 7 });
      },
      {
        name: 'TypeError',
        message: 'Expected property "test" to be /[0-9]/ but got 7',
        code: 'E_SCHEMA'
      }
    );
  });

  it('requires the string to match the regular expression', () => {
    const regexpSchema = schema({ test: /[0-9]/ });

    assert.exception(
      () => {
        regexpSchema({ test: 'foo' });
      },
      {
        name: 'TypeError',
        message: 'Expected property "test" to be /[0-9]/ but got "foo"',
        code: 'E_SCHEMA'
      }
    );
  });
});
