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
    }, /TypeError: Expected property "test" to be null but got undefined/);
    assert.exception(() => {
      schema({ test: 'test' });
    }, /TypeError: Expected property "test" to be null but got "test"/);
  });

});
