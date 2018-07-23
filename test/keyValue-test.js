/*eslint-env mocha*/
'use strict';

const { assert, refute } = require('@sinonjs/referee-sinon');
const { spec, keyValue, opt, one } = require('..');

describe('keyValue', () => {

  it('requires both arguments to be valid specs', () => {
    assert.exception(() => {
      keyValue();
    }, {
      name: 'Error',
      message: 'Invalid spec undefined'
    });
    assert.exception(() => {
      keyValue('string');
    }, {
      name: 'Error',
      message: 'Invalid spec undefined'
    });
    assert.exception(() => {
      keyValue('string', 'unknown');
    }, {
      name: 'Error',
      message: 'Invalid spec "unknown"'
    });
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
    }, {
      name: 'TypeError',
      message: 'Expected keyValue(string, number) but got []',
      code: 'SCHEMA_VALIDATION'
    });
    assert.exception(() => {
      schema('test');
    }, {
      name: 'TypeError',
      message: 'Expected keyValue(string, number) but got "test"',
      code: 'SCHEMA_VALIDATION'
    });
  });

  it('fails for invalid keys', () => {
    const schema = spec(keyValue('number', 'string'));

    assert.exception(() => {
      schema({ 0: 'ok' });
    }, {
      name: 'TypeError',
      message: 'Expected keyValue(number, string) but got {"0":"ok"}',
      code: 'SCHEMA_VALIDATION'
    });
    assert.exception(() => {
      schema({ abc: 'ok' });
    }, {
      name: 'TypeError',
      message: 'Expected keyValue(number, string) but got {"abc":"ok"}',
      code: 'SCHEMA_VALIDATION'
    });
  });

  it('fails for invalid objects', () => {
    const schema = spec(keyValue('string', 'number'));

    assert.exception(() => {
      schema({ foo: true });
    }, {
      name: 'TypeError',
      message: 'Expected keyValue(string, number) but got {"foo":true}',
      code: 'SCHEMA_VALIDATION'
    });
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
    }, {
      name: 'TypeError',
      message: 'Expected opt(keyValue(string, number)) but got {"foo":""}',
      code: 'SCHEMA_VALIDATION'
    });
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
    }, {
      name: 'TypeError',
      message: 'Expected one(boolean, keyValue(string, number)) but got '
        + '"something"',
      code: 'SCHEMA_VALIDATION'
    });
    assert.exception(() => {
      schema({ foo: '' });
    }, {
      name: 'TypeError',
      message: 'Expected one(boolean, keyValue(string, number)) but got '
        + '{"foo":""}',
      code: 'SCHEMA_VALIDATION'
    });
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
    }, {
      name: 'TypeError',
      message: 'Expected keyValue(string, opt(number)) but got {"foo":null}',
      code: 'SCHEMA_VALIDATION'
    });
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
    }, {
      name: 'TypeError',
      message: 'Expected keyValue(string, one(boolean, number)) but got '
        + '{"foo":""}',
      code: 'SCHEMA_VALIDATION'
    });
  });

});
