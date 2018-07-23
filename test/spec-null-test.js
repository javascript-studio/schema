/*eslint-env mocha*/
'use strict';

const { assert, refute } = require('@sinonjs/referee-sinon');
const { spec } = require('..');

describe('spec null', () => {

  it('validates null', () => {
    const schema = spec({ test: null });

    refute.exception(() => {
      schema({ test: null });
    });
    assert.exception(() => {
      schema({ test: undefined });
    }, {
      name: 'TypeError',
      message: 'Expected property "test" to be null but got undefined',
      code: 'SCHEMA_VALIDATION'
    });
    assert.exception(() => {
      schema({ test: 'test' });
    }, {
      name: 'TypeError',
      message: 'Expected property "test" to be null but got "test"',
      code: 'SCHEMA_VALIDATION'
    });
  });

  it('returns given object', () => {
    const schema = spec({ test: null });
    const object = { test: null };

    const returned = schema(object);

    assert.same(returned, object);
  });

});
