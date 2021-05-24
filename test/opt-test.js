/*eslint-env mocha*/
'use strict';

const { assert, refute, sinon } = require('@sinonjs/referee-sinon');
const { schema, opt } = require('..');

describe('opt', () => {

  it('does not throw on undefined', () => {
    const optSchema = schema(opt('string'));

    refute.exception(() => {
      optSchema(undefined);
    });
  });

  it('does not throw if given schema is valid', () => {
    const optSchema = schema(opt('string'));

    refute.exception(() => {
      optSchema('');
      optSchema('test');
    });
  });

  it('invokes custom function with value', () => {
    const fake = sinon.fake();
    const optSchema = opt(fake);

    optSchema('test');

    assert.calledOnceWith(fake, 'test');
  });

  it('fails if value is invalid', () => {
    const optSchema = schema(opt('string'));

    assert.exception(() => {
      optSchema(123);
    }, {
      name: 'TypeError',
      message: 'Expected opt(string) but got 123',
      code: 'SCHEMA_VALIDATION'
    });
    assert.exception(() => {
      optSchema(0);
    }, {
      name: 'TypeError',
      message: 'Expected opt(string) but got 0',
      code: 'SCHEMA_VALIDATION'
    });
    assert.exception(() => {
      optSchema(false);
    }, {
      name: 'TypeError',
      message: 'Expected opt(string) but got false',
      code: 'SCHEMA_VALIDATION'
    });
    assert.exception(() => {
      optSchema(true);
    }, {
      name: 'TypeError',
      message: 'Expected opt(string) but got true',
      code: 'SCHEMA_VALIDATION'
    });
  });

  it('does not fail to JSON.stringify a schema with a missing optional', () => {
    const optSchema = schema({
      name: 'string',
      age: opt('integer')
    });

    const json = optSchema.write({ name: 'Max' });

    assert.json(JSON.stringify(json), { name: 'Max' });
  });

  it('does not fail to delete', () => {
    const optSchema = schema({
      age: opt('integer')
    });

    const json = optSchema.write({ age: 41 });

    refute.exception(() => {
      delete json.age;
    });
  });

  it('fails to assign undefined', () => {
    const optSchema = schema({
      age: opt('integer')
    });

    const json = optSchema.write({ age: 41 });

    assert.exception(() => {
      json.age = '';
    }, {
      name: 'TypeError',
      message: 'Expected property "age" to be opt(integer) but got ""',
      code: 'SCHEMA_VALIDATION'
    });
  });

  it('fails to initialize writer with undefined', () => {
    const optSchema = schema({
      age: opt('integer')
    });

    assert.exception(() => {
      optSchema.write({ age: NaN });
    }, {
      name: 'TypeError',
      message: 'Expected property "age" to be opt(integer) but got NaN',
      code: 'SCHEMA_VALIDATION'
    });
  });

  it('fails to initialize reader with undefined', () => {
    const optSchema = schema({
      age: opt('integer')
    });

    assert.exception(() => {
      optSchema.read({ age: false });
    }, {
      name: 'TypeError',
      message: 'Expected property "age" to be opt(integer) but got false',
      code: 'SCHEMA_VALIDATION'
    });
  });

  it('fails validator with undefined', () => {
    const optSchema = schema({
      age: opt('integer')
    });

    assert.exception(() => {
      optSchema({ age: true });
    }, {
      name: 'TypeError',
      message: 'Expected property "age" to be opt(integer) but got true',
      code: 'SCHEMA_VALIDATION'
    });
  });

  it('fails validator with custom function', () => {
    const optSchema = schema(opt(() => false));

    assert.exception(() => {
      optSchema(1);
    }, {
      name: 'TypeError',
      message: 'Expected opt(custom value) but got 1',
      code: 'SCHEMA_VALIDATION'
    });
  });


  it('does not add `verify` or specName to given function', () => {
    const fn = () => true;

    opt(fn);

    assert.isUndefined(Object.getOwnPropertyDescriptor(fn, 'verify'));
    assert.isUndefined(Object.getOwnPropertyDescriptor(fn, 'specName'));
  });
});
