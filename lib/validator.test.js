'use strict';

const { assert, sinon } = require('@sinonjs/referee-sinon');
const { schema } = require('..');
const { validator } = require('./validator');

describe('validator', () => {
  it('is exposed on schema', () => {
    assert.same(schema.validator, validator);
  });

  it('returns the given function', () => {
    const test = function (_) {
      return false;
    };

    const validate = validator(test);

    assert.same(validate, test);
  });

  it('sets "<custom validator>" as the default name', () => {
    const test = (() =>
      function (_) {
        return false;
      })();

    const validate = validator(test);

    assert.equals(validate.toString(), '<custom validator>');
  });

  it('adds the second argument as the name', () => {
    const test = function (_) {
      return false;
    };

    const validate = validator(test, 'the validator name');

    assert.equals(validate.toString(), 'the validator name');
  });

  it('adds the second argument as the toString function', () => {
    const test = function (_) {
      return false;
    };
    const toString = () => 'the validator name';

    const validate = validator(test, toString);

    assert.same(validate.toString, toString);
  });

  it('add a default verify function', () => {
    const test = sinon.fake();

    const validate = validator(test);
    validate.verify('test');

    assert.calledOnceWith(test, 'test');
  });

  it('adds the third argument as the verify function', () => {
    const test = function (_) {
      return false;
    };
    const toString = () => 'test name';
    const verify = () => false;

    const validate = validator(test, toString, verify);

    assert.same(validate.verify, verify);
  });
});
