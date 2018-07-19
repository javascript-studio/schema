/*eslint-env mocha*/
'use strict';

const { assert, refute } = require('@sinonjs/referee-sinon');
const { spec } = require('..');

describe('spec null', () => {

  it('validates null', () => {
    const schema = spec(null);

    refute.exception(() => {
      schema(null);
    });
    assert.exception(() => {
      schema(undefined);
    }, /TypeError: Expected null but got undefined/);
    assert.exception(() => {
      schema('test');
    }, /TypeError: Expected null but got "test"/);
  });

});
