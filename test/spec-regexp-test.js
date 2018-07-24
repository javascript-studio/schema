/*eslint-env mocha*/
'use strict';

const { assert, refute } = require('@sinonjs/referee-sinon');
const { spec } = require('..');

describe('spec regexp', () => {

  it('requires a string', () => {
    const schema = spec({ test: /[0-9]/ });

    refute.exception(() => {
      schema({ test: '7' });
    });
    refute.exception(() => {
      schema({ test: 'some 7' });
    });
    assert.exception(() => {
      schema({ test: undefined });
    }, {
      name: 'TypeError',
      message: 'Expected property "test" to be /[0-9]/ but got undefined',
      code: 'SCHEMA_VALIDATION'
    });
    assert.exception(() => {
      schema({ test: 7 });
    }, {
      name: 'TypeError',
      message: 'Expected property "test" to be /[0-9]/ but got 7',
      code: 'SCHEMA_VALIDATION'
    });
  });

  it('requires the string to match the regular expression', () => {
    const schema = spec({ test: /[0-9]/ });

    assert.exception(() => {
      schema({ test: 'foo' });
    }, {
      name: 'TypeError',
      message: 'Expected property "test" to be /[0-9]/ but got "foo"',
      code: 'SCHEMA_VALIDATION'
    });
  });

});
