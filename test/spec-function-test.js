/*eslint-env mocha*/
'use strict';

const { assert, refute, sinon } = require('@sinonjs/referee-sinon');
const { spec } = require('..');

describe('spec function', () => {

  it('calls function with argument', () => {
    const fn = sinon.fake();

    const schema = spec({ test: fn });

    refute.exception(() => {
      schema({ test: 'something' });
    });
    assert.calledOnceWith(fn, 'something');
  });

  it('does nothing if function returns `true`', () => {
    const schema = spec({ test: () => true });

    refute.exception(() => {
      schema({ test: 'something' });
    });
  });

  it('throws if function returns `false`', () => {
    const schema = spec({ test: () => false });

    assert.exception(() => {
      schema({ test: 'something' });
    // eslint-disable-next-line max-len
    }, /TypeError: Expected property "test" to be custom value but got "something"/);
  });

  it('returns given object', () => {
    const schema = spec({ test: () => true });
    const object = { test: 'something' };

    const returned = schema(object);

    assert.same(returned, object);
  });

});
