'use strict';

const { assert, refute, sinon } = require('@sinonjs/referee-sinon');
const { schema } = require('..');

describe('schema function', () => {
  it('calls function with argument', () => {
    const fn = sinon.fake();

    const funcSchema = schema({ test: fn });

    refute.exception(() => {
      funcSchema({ test: 'something' });
    });
    assert.calledOnceWith(fn, 'something');
  });

  it('does nothing if function returns `true`', () => {
    const funcSchema = schema({ test: () => true });

    refute.exception(() => {
      funcSchema({ test: false });
    });
  });

  it('throws if function returns `false`', () => {
    const funcSchema = schema(() => false);

    assert.exception(
      () => {
        funcSchema(false);
      },
      {
        name: 'TypeError',
        message: 'Expected <custom validator> but got false',
        code: 'SCHEMA_VALIDATION'
      }
    );
  });

  it('throws if function returns `false` in object schema', () => {
    const funcSchema = schema({ test: () => false });

    assert.exception(
      () => {
        funcSchema({ test: false });
      },
      {
        name: 'TypeError',
        message: 'Expected property "test" to be test but got false',
        code: 'SCHEMA_VALIDATION'
      }
    );
  });

  it('does not add `verify` or toString to given function', () => {
    const fn = () => true;

    schema(() => true);

    assert.isUndefined(Object.getOwnPropertyDescriptor(fn, 'verify'));
    assert.isUndefined(Object.getOwnPropertyDescriptor(fn, 'toString'));
  });

  it('returns given object for function', () => {
    const funcSchema = schema(() => true);
    const object = {};

    const returned = funcSchema(object);

    assert.same(returned, object);
  });

  it('returns given object for object with function property', () => {
    const funcSchema = schema({ test: () => true });
    const object = { test: 'something' };

    const returned = funcSchema(object);

    assert.same(returned, object);
  });

  it('uses the function name as the toString', () => {
    function myCustomTest() {
      return false;
    }

    const funcSchema = schema(myCustomTest);

    assert.exception(
      () => {
        funcSchema(42);
      },
      {
        name: 'TypeError',
        message: 'Expected myCustomTest but got 42',
        code: 'SCHEMA_VALIDATION'
      }
    );
  });
});
