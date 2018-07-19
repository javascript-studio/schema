/*eslint-env mocha*/
'use strict';

const { assert, refute, sinon } = require('@sinonjs/referee-sinon');
const { spec } = require('..');

describe('spec function', () => {

  it('calls function with argument', () => {
    const fn = sinon.fake();

    const schema = spec(fn);

    refute.exception(() => {
      schema('something');
    });
    assert.calledOnceWith(fn, 'something');
  });

  it('does nothing if function returns `true`', () => {
    const fn = sinon.fake.returns(true);

    const schema = spec(fn);

    refute.exception(() => {
      schema('something');
    });
  });

  it('throws if function returns `false`', () => {
    const fn = sinon.fake.returns(false);

    const schema = spec(fn);

    assert.exception(() => {
      schema('something');
    }, /TypeError: Unexpected "something"/);
  });

  it('uses second argument in exception message', () => {
    const fn = sinon.fake.returns(false);

    const schema = spec(fn, 'nothing');

    assert.exception(() => {
      schema('something');
    }, /TypeError: Expected nothing but got "something"/);
  });

});
