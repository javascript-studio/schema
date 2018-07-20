/*eslint-env mocha*/
'use strict';

const { assert, refute } = require('@sinonjs/referee-sinon');
const { spec, object, opt, one } = require('..');

describe('object', () => {

  it('throws one argument is not a valid spec', () => {
    assert.exception(() => {
      object();
    }, /Error: Invalid spec undefined/);
    assert.exception(() => {
      object('string');
    }, /Error: Invalid spec undefined/);
    assert.exception(() => {
      object('string', 'unknown');
    }, /Error: Invalid spec "unknown"/);
  });

  it('does not fail for valid objects', () => {
    const schema = spec({ test: object('string', 'number') });

    refute.exception(() => {
      schema({ test: {} });
      schema({ test: { 0: 0 } });
      schema({ test: { foo: 1 } });
      schema({ test: { bar: 2 } });
    });
  });

  it('fails for non-objects', () => {
    const schema = spec({ test: object('string', 'number') });

    assert.exception(() => {
      schema({ test: [] });
    // eslint-disable-next-line max-len
    }, /TypeError: Expected property "test" to be object\(string, number\) but got \[\]/);
    assert.exception(() => {
      schema({ test: 'test' });
    // eslint-disable-next-line max-len
    }, /TypeError: Expected property "test" to be object\(string, number\) but got "test"/);
  });

  it('fails for invalid keys', () => {
    const schema = spec({ test: object('number', 'string') });

    assert.exception(() => {
      schema({ test: { 0: 'ok' } });
    // eslint-disable-next-line max-len
    }, /TypeError: Expected property "test" to be object\(number, string\) but got {"0":"ok"}/);
    assert.exception(() => {
      schema({ test: { abc: 'ok' } });
    // eslint-disable-next-line max-len
    }, /TypeError: Expected property "test" to be object\(number, string\) but got {"abc":"ok"}/);
  });

  it('fails for invalid objects', () => {
    const schema = spec({ test: object('string', 'number') });

    assert.exception(() => {
      schema({ test: { foo: true } });
    // eslint-disable-next-line max-len
    }, /TypeError: Expected property "test" to be object\(string, number\) but got {"foo":true}/);
  });

  it('works within `opt`', () => {
    const schema = spec({ test: opt(object('string', 'number')) });

    refute.exception(() => {
      schema({});
      schema({ test: {} });
      schema({ test: { foo: 0 } });
    });
    assert.exception(() => {
      schema({ test: { foo: '' } });
    // eslint-disable-next-line max-len
    }, /TypeError: Expected property "test" to be opt\(object\(string, number\)\) but got {"foo":""}/);
  });

  it('works within `one`', () => {
    const schema = spec({ test: one('boolean', object('string', 'number')) });

    refute.exception(() => {
      schema({ test: true });
      schema({ test: false });
      schema({ test: {} });
      schema({ test: { foo: 0 } });
    });
    assert.exception(() => {
      schema({ test: 'something' });
    // eslint-disable-next-line max-len
    }, /TypeError: Expected property "test" to be one\(boolean, object\(string, number\)\) but got "something"/);
    assert.exception(() => {
      schema({ test: { foo: '' } });
    // eslint-disable-next-line max-len
    }, /TypeError: Expected property "test" to be one\(boolean, object\(string, number\)\) but got {"foo":""}/);
  });

  it('works using `opt`', () => {
    const schema = spec({ test: object('string', opt('number')) });

    refute.exception(() => {
      schema({ test: {} });
      schema({ test: { foo: undefined } });
      schema({ test: { foo: 1 } });
    });
    assert.exception(() => {
      schema({ test: { foo: null } });
    // eslint-disable-next-line max-len
    }, /TypeError: Expected property "test" to be object\(string, opt\(number\)\) but got {"foo":null}/);
  });

  it('works using `one`', () => {
    const schema = spec({ test: object('string', one('boolean', 'number')) });

    refute.exception(() => {
      schema({ test: {} });
      schema({ test: { foo: 0 } });
      schema({ test: { foo: true } });
      schema({ test: { foo: false } });
    });
    assert.exception(() => {
      schema({ test: { foo: '' } });
    // eslint-disable-next-line max-len
    }, /TypeError: Expected property "test" to be object\(string, one\(boolean, number\)\) but got {"foo":""}/);
  });

});
