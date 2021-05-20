/*eslint-env mocha*/
'use strict';

const { assert, refute, sinon } = require('@sinonjs/referee-sinon');
const { spec, opt } = require('..');

describe('opt', () => {

  it('does not throw on undefined', () => {
    const schema = spec(opt('string'));

    refute.exception(() => {
      schema(undefined);
    });
  });

  it('does not throw if given schema is valid', () => {
    const schema = spec(opt('string'));

    refute.exception(() => {
      schema('');
      schema('test');
    });
  });

  it('invokes custom function with value', () => {
    const fake = sinon.fake();
    const schema = opt(fake);

    schema('test');

    assert.calledOnceWith(fake, 'test');
  });

  it('fails if value is invalid', () => {
    const schema = spec(opt('string'));

    assert.exception(() => {
      schema(123);
    }, {
      name: 'TypeError',
      message: 'Expected opt(string) but got 123',
      code: 'SCHEMA_VALIDATION'
    });
    assert.exception(() => {
      schema(0);
    }, {
      name: 'TypeError',
      message: 'Expected opt(string) but got 0',
      code: 'SCHEMA_VALIDATION'
    });
    assert.exception(() => {
      schema(false);
    }, {
      name: 'TypeError',
      message: 'Expected opt(string) but got false',
      code: 'SCHEMA_VALIDATION'
    });
    assert.exception(() => {
      schema(true);
    }, {
      name: 'TypeError',
      message: 'Expected opt(string) but got true',
      code: 'SCHEMA_VALIDATION'
    });
  });

  it('does not fail to JSON.stringify a spec with a missing optional', () => {
    const schema = spec({
      name: 'string',
      age: opt('integer')
    });

    const json = schema.write({ name: 'Max' });

    assert.json(JSON.stringify(json), { name: 'Max' });
  });

  it('does not fail to delete', () => {
    const schema = spec({
      age: opt('integer')
    });

    const json = schema.write({ age: 41 });

    refute.exception(() => {
      delete json.age;
    });
  });

  it('fails to assign undefined', () => {
    const schema = spec({
      age: opt('integer')
    });

    const json = schema.write({ age: 41 });

    assert.exception(() => {
      json.age = '';
    }, {
      name: 'TypeError',
      message: 'Expected property "age" to be opt(integer) but got ""',
      code: 'SCHEMA_VALIDATION'
    });
  });

  it('fails to initialize writer with undefined', () => {
    const schema = spec({
      age: opt('integer')
    });

    assert.exception(() => {
      schema.write({ age: NaN });
    }, {
      name: 'TypeError',
      message: 'Expected property "age" to be opt(integer) but got NaN',
      code: 'SCHEMA_VALIDATION'
    });
  });

  it('fails to initialize reader with undefined', () => {
    const schema = spec({
      age: opt('integer')
    });

    assert.exception(() => {
      schema.read({ age: false });
    }, {
      name: 'TypeError',
      message: 'Expected property "age" to be opt(integer) but got false',
      code: 'SCHEMA_VALIDATION'
    });
  });

  it('fails validator with undefined', () => {
    const schema = spec({
      age: opt('integer')
    });

    assert.exception(() => {
      schema({ age: true });
    }, {
      name: 'TypeError',
      message: 'Expected property "age" to be opt(integer) but got true',
      code: 'SCHEMA_VALIDATION'
    });
  });

  it('fails validator with custom function', () => {
    const schema = spec(opt(() => false));

    assert.exception(() => {
      schema(1);
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
