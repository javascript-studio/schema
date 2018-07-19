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
    const schema = spec(() => true);

    refute.exception(() => {
      schema('something');
    });
  });

  it('throws if function returns `false`', () => {
    const schema = spec(() => false);

    assert.exception(() => {
      schema('something');
    }, /TypeError: Expected custom value but got "something"/);
  });

  it('uses second argument in exception message', () => {
    const schema = spec(() => false, 'nothing');

    assert.exception(() => {
      schema('something');
    }, /TypeError: Expected nothing but got "something"/);
  });

  it('uses function name in exception message', () => {
    function special() {
      return false;
    }
    const schema = spec(special);

    assert.exception(() => {
      schema('something');
    }, /TypeError: Expected special but got "something"/);
  });

  it('prefers second argument over function name in exception message', () => {
    function special() {
      return false;
    }
    const schema = spec(special, 'nothing');

    assert.exception(() => {
      schema('something');
    }, /TypeError: Expected nothing but got "something"/);
  });

});
