'use strict';

const { assert, refute } = require('@sinonjs/referee-sinon');
const { assertType } = require('./assert-type');

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
