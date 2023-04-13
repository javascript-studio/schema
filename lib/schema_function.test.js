'use strict';

const { assert, refute, sinon } = require('@sinonjs/referee-sinon');
const { schema, validator, object } = require('..');

describe('schema function', () => {
  it('calls function with argument', () => {
    const fn = sinon.fake();

    const funcSchema = schema(object({ test: validator(fn) }));

    refute.exception(() => {
      funcSchema({ test: 'something' });
    });
    assert.calledOnceWith(fn, 'something');
  });

  it('does nothing if function returns `true`', () => {
    const funcSchema = schema(object({ test: validator(() => true) }));

    refute.exception(() => {
      funcSchema({ test: false });
    });
  });

  it('throws if function returns `false`', () => {
    const funcSchema = schema(validator(() => false));

    assert.exception(
      () => {
        funcSchema(false);
      },
      {
        name: 'TypeError',
        message: 'Expected <custom validator> but got false',
        code: 'E_SCHEMA'
      }
    );
  });

  it('throws if function returns `false` in object schema', () => {
    const funcSchema = schema(object({ test: validator(() => false) }));

    assert.exception(
      () => {
        funcSchema({ test: false });
      },
      {
        name: 'TypeError',
        message:
          'Expected property "test" to be <custom validator> but got false',
        code: 'E_SCHEMA'
      }
    );
  });

  it('does not add `verify` or toString to given function', () => {
    const fn = () => true;

    schema(validator(() => true));

    assert.isUndefined(Object.getOwnPropertyDescriptor(fn, 'verify'));
    assert.isUndefined(Object.getOwnPropertyDescriptor(fn, 'toString'));
  });

  it('returns given object for function', () => {
    const funcSchema = schema(validator(() => true));

    const returned = funcSchema('test');

    assert.same(returned, 'test');
  });

  it('returns given object for object with function property', () => {
    const funcSchema = schema(object({ test: validator(() => true) }));
    const obj = { test: 'something' };

    const returned = funcSchema(obj);

    assert.same(returned, obj);
  });

  it('uses the function name as the toString', () => {
    function myCustomTest() {
      return false;
    }

    const funcSchema = schema(validator(myCustomTest));

    assert.exception(
      () => {
        funcSchema(42);
      },
      {
        name: 'TypeError',
        message: 'Expected myCustomTest but got 42',
        code: 'E_SCHEMA'
      }
    );
  });
});
