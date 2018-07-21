/*eslint-env mocha*/
'use strict';

const { assert, refute } = require('@sinonjs/referee-sinon');
const { spec, keyValue, opt, one } = require('..');

describe('keyValue', () => {

  it('requires both arguments to be valid specs', () => {
    assert.exception(() => {
      keyValue();
    }, /Error: Invalid spec undefined/);
    assert.exception(() => {
      keyValue('string');
    }, /Error: Invalid spec undefined/);
    assert.exception(() => {
      keyValue('string', 'unknown');
    }, /Error: Invalid spec "unknown"/);
  });

  it('does not fail for valid objects', () => {
    const schema = spec(keyValue('string', 'number'));

    refute.exception(() => {
      schema({});
      schema({ 0: 0 });
      schema({ foo: 1 });
      schema({ bar: 2 });
    });
  });

  it('fails for non-objects', () => {
    const schema = spec(keyValue('string', 'number'));

    assert.exception(() => {
      schema([]);
    }, /TypeError: Expected keyValue\(string, number\) but got \[\]/);
    assert.exception(() => {
      schema('test');
    }, /TypeError: Expected keyValue\(string, number\) but got "test"/);
  });

  it('fails for invalid keys', () => {
    const schema = spec(keyValue('number', 'string'));

    assert.exception(() => {
      schema({ 0: 'ok' });
    }, /TypeError: Expected keyValue\(number, string\) but got {"0":"ok"}/);
    assert.exception(() => {
      schema({ abc: 'ok' });
    }, /TypeError: Expected keyValue\(number, string\) but got {"abc":"ok"}/);
  });

  it('fails for invalid objects', () => {
    const schema = spec(keyValue('string', 'number'));

    assert.exception(() => {
      schema({ foo: true });
    }, /TypeError: Expected keyValue\(string, number\) but got {"foo":true}/);
  });

  it('works within `opt`', () => {
    const schema = spec(opt(keyValue('string', 'number')));

    refute.exception(() => {
      schema(undefined);
      schema({});
      schema({ foo: 0 });
    });
    assert.exception(() => {
      schema({ foo: '' });
    // eslint-disable-next-line max-len
    }, /TypeError: Expected opt\(keyValue\(string, number\)\) but got {"foo":""}/);
  });

  it('works within `one`', () => {
    const schema = spec(one('boolean', keyValue('string', 'number')));

    refute.exception(() => {
      schema(true);
      schema(false);
      schema({});
      schema({ foo: 0 });
    });
    assert.exception(() => {
      schema('something');
    // eslint-disable-next-line max-len
    }, /TypeError: Expected one\(boolean, keyValue\(string, number\)\) but got "something"/);
    assert.exception(() => {
      schema({ foo: '' });
    // eslint-disable-next-line max-len
    }, /TypeError: Expected one\(boolean, keyValue\(string, number\)\) but got {"foo":""}/);
  });

  it('works using `opt`', () => {
    const schema = spec(keyValue('string', opt('number')));

    refute.exception(() => {
      schema({});
      schema({ foo: undefined });
      schema({ foo: 1 });
    });
    assert.exception(() => {
      schema({ foo: null });
    // eslint-disable-next-line max-len
    }, /TypeError: Expected keyValue\(string, opt\(number\)\) but got {"foo":null}/);
  });

  it('works using `one`', () => {
    const schema = spec(keyValue('string', one('boolean', 'number')));

    refute.exception(() => {
      schema({});
      schema({ foo: 0 });
      schema({ foo: true });
      schema({ foo: false });
    });
    assert.exception(() => {
      schema({ foo: '' });
    // eslint-disable-next-line max-len
    }, /TypeError: Expected keyValue\(string, one\(boolean, number\)\) but got {"foo":""}/);
  });

});
