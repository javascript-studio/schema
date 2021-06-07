'use strict';

const { assert, sinon } = require('@sinonjs/referee-sinon');
const { schema } = require('..');
const { SPEC_NAME } = require('./constants');
const { validator } = require('./validator');

describe('validator', () => {
  it('is exposed on schema', () => {
    assert.same(schema.validator, validator);
  });

  it('returns the given function', () => {
    const test = function () {};

    const validate = validator(test);

    assert.same(validate, test);
  });

  it('sets "<custom validator>" as the default SPEC_NAME', () => {
    const test = function () {};

    const validate = validator(test);

    assert.equals(validate[SPEC_NAME], '<custom validator>');
  });

  it('adds the second argument as the SPEC_NAME', () => {
    const test = function () {};

    const validate = validator(test, 'spec name');

    assert.equals(validate[SPEC_NAME], 'spec name');
  });

  it('adds the second argument as a lazy SPEC_NAME factory', () => {
    const test = function () {};
    const specName = () => 'spec name';

    const validate = validator(test, specName);

    assert.equals(validate[SPEC_NAME], 'spec name');
  });

  it('add a default verify function', () => {
    const test = sinon.fake();
    const value = Symbol('test value');

    const validate = validator(test);
    validate.verify(value);

    assert.calledOnceWith(test, value);
  });

  it('adds the third argument as the verify function', () => {
    const test = function () {};
    const specName = () => 'spec name';
    const verify = () => false;

    const validate = validator(test, specName, verify);

    assert.same(validate.verify, verify);
  });
});
