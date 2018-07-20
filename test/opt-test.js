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
    }, /TypeError: Expected opt\(string\) but got 123/);
    assert.exception(() => {
      schema(0);
    }, /TypeError: Expected opt\(string\) but got 0/);
    assert.exception(() => {
      schema(false);
    }, /TypeError: Expected opt\(string\) but got false/);
    assert.exception(() => {
      schema(true);
    }, /TypeError: Expected opt\(string\) but got true/);
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
    }, /TypeError: Expected property "age" to be opt\(integer\) but got ""/);
  });

  it('fails to initialize writer with undefined', () => {
    const schema = spec({
      age: opt('integer')
    });

    assert.exception(() => {
      schema.write({ age: NaN });
    }, /TypeError: Expected property "age" to be opt\(integer\) but got NaN/);
  });

  it('fails to initialize reader with undefined', () => {
    const schema = spec({
      age: opt('integer')
    });

    assert.exception(() => {
      schema.read({ age: false });
    }, /TypeError: Expected property "age" to be opt\(integer\) but got false/);
  });

  it('fails validator with undefined', () => {
    const schema = spec({
      age: opt('integer')
    });

    assert.exception(() => {
      schema({ age: true });
    }, /TypeError: Expected property "age" to be opt\(integer\) but got true/);
  });

  it('fails validator with custom function', () => {
    const schema = spec(opt(() => false));

    assert.exception(() => {
      schema(1);
    }, /TypeError: Expected opt\(custom value\) but got 1/);
  });

});
