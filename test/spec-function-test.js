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
      schema({ test: false });
    });
  });

  it('throws if function returns `false`', () => {
    const schema = spec(() => false);

    assert.exception(() => {
      schema(false);
    }, /TypeError: Expected custom value but got false/);
  });

  it('throws if function returns `false` in object spec', () => {
    const schema = spec({ test: () => false });

    assert.exception(() => {
      schema({ test: false });
    }, /TypeError: Expected property "test" to be custom value but got false/);
  });

  it('does not add `verify` or specName to given function', () => {
    const fn = () => true;

    spec(() => true);

    refute.defined(Object.getOwnPropertyDescriptor(fn, 'verify'));
    refute.defined(Object.getOwnPropertyDescriptor(fn, 'specName'));
  });

  it('returns given object for function', () => {
    const schema = spec(() => true);
    const object = {};

    const returned = schema(object);

    assert.same(returned, object);
  });

  it('returns given object for object with function property', () => {
    const schema = spec({ test: () => true });
    const object = { test: 'something' };

    const returned = schema(object);

    assert.same(returned, object);
  });

});
