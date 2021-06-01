/*eslint-env mocha*/
'use strict';

const { assert, sinon } = require('@sinonjs/referee-sinon');
const { raw, unwrap } = require('../lib/raw');

describe('raw', () => {
  it('returns toJSON result of given value', () => {
    const expected = Symbol('toJSON result');
    const value = { toJSON: sinon.fake.returns(expected) };

    const result = raw(value);

    assert.same(result, expected);
  });

  it('throws if given object does not have a toJSON function', () => {
    assert.exception(() => {
      raw({});
    }, {
      name: 'Error',
      message: 'Argument is not a schema reader or writer'
    });
  });
});

describe('unwrap', () => {
  it('returns toJSON result of given value', () => {
    const expected = Symbol('toJSON result');
    const value = { toJSON: sinon.fake.returns(expected) };

    const result = unwrap(value);

    assert.same(result, expected);
  });

  it('returns give value if it does not have a toJSON function', () => {
    const value = Symbol('the value');

    const result = unwrap(value);

    assert.same(result, value);
  });
});
