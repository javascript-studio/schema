/*eslint-env mocha*/
'use strict';

const { assert, refute } = require('@sinonjs/referee-sinon');
const { schema } = require('..');

describe('spec regexp', () => {
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
        message: 'Expected property "test" to be /[0-9]/ but got undefined',
        code: 'SCHEMA_VALIDATION'
      }
    );
    assert.exception(
      () => {
        regexpSchema({ test: 7 });
      },
      {
        name: 'TypeError',
        message: 'Expected property "test" to be /[0-9]/ but got 7',
        code: 'SCHEMA_VALIDATION'
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
        code: 'SCHEMA_VALIDATION'
      }
    );
  });
});
