/*eslint-env mocha*/
'use strict';

const { assert, refute } = require('@sinonjs/referee-sinon');
const { spec, map, opt, one } = require('..');

describe('map', () => {

  it('requires both arguments to be valid specs', () => {
    assert.exception(() => {
      map();
    }, {
      name: 'Error',
      message: 'Invalid spec undefined'
    });
    assert.exception(() => {
      map('string');
    }, {
      name: 'Error',
      message: 'Invalid spec undefined'
    });
    assert.exception(() => {
      map('string', 'unknown');
    }, {
      name: 'Error',
      message: 'Invalid spec "unknown"'
    });
  });

  it('does not fail for valid objects', () => {
    const schema = spec(map('string', 'number'));

    refute.exception(() => {
      schema({});
      schema({ 0: 0 });
      schema({ foo: 1 });
      schema({ bar: 2 });
    });
  });

  it('fails for non-objects', () => {
    const schema = spec(map('string', 'number'));

    assert.exception(() => {
      schema([]);
    }, {
      name: 'TypeError',
      message: 'Expected object but got []',
      code: 'SCHEMA_VALIDATION'
    });
    assert.exception(() => {
      schema('test');
    }, {
      name: 'TypeError',
      message: 'Expected object but got "test"',
      code: 'SCHEMA_VALIDATION'
    });
  });

  it('fails for invalid keys', () => {
    const schema = spec(map(/^[a-z]$/, 'string'));

    assert.exception(() => {
      schema({ 0: 'ok' });
    }, {
      name: 'TypeError',
      message: 'Expected key "0" to be /^[a-z]$/',
      code: 'SCHEMA_VALIDATION'
    });
    assert.exception(() => {
      schema({ abc: 'ok' });
    }, {
      name: 'TypeError',
      message: 'Expected key "abc" to be /^[a-z]$/',
      code: 'SCHEMA_VALIDATION'
    });
  });

  it('fails for invalid objects', () => {
    const schema = spec(map('string', 'number'));

    assert.exception(() => {
      schema({ foo: true });
    }, {
      name: 'TypeError',
      message: 'Expected property "foo" to be number but got true',
      code: 'SCHEMA_VALIDATION'
    });
  });

  it('validates value object', () => {
    const schema = spec(map('string', { index: 'number' }));

    assert.exception(() => {
      schema({ foo: { index: 'invalid' } });
    }, {
      name: 'TypeError',
      message: 'Expected property "foo.index" to be number but got "invalid"',
      code: 'SCHEMA_VALIDATION'
    });
  });

  it('works within `opt`', () => {
    const schema = spec(opt(map('string', 'number')));

    refute.exception(() => {
      schema(undefined);
      schema({});
      schema({ foo: 0 });
    });
    assert.exception(() => {
      schema({ foo: '' });
    }, {
      name: 'TypeError',
      message: 'Expected opt(map(string, number)) but got {"foo":""}',
      code: 'SCHEMA_VALIDATION'
    });
  });

  it('works within `one`', () => {
    const schema = spec(one('boolean', map('string', 'number')));

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
      message: 'Expected one(boolean, map(string, number)) but got '
        + '"something"',
      code: 'SCHEMA_VALIDATION'
    });
    assert.exception(() => {
      schema({ foo: '' });
    }, {
      name: 'TypeError',
      message: 'Expected one(boolean, map(string, number)) but got '
        + '{"foo":""}',
      code: 'SCHEMA_VALIDATION'
    });
  });

  it('works using `opt`', () => {
    const schema = spec(map('string', opt('number')));

    refute.exception(() => {
      schema({});
      schema({ foo: undefined });
      schema({ foo: 1 });
    });
    assert.exception(() => {
      schema({ foo: null });
    }, {
      name: 'TypeError',
      message: 'Expected property "foo" to be opt(number) but got null',
      code: 'SCHEMA_VALIDATION'
    });
  });

  it('works using `one`', () => {
    const schema = spec(map('string', one('boolean', 'number')));

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
      message: 'Expected property "foo" to be one(boolean, number) but got ""',
      code: 'SCHEMA_VALIDATION'
    });
  });

  context('reader', () => {
    it('serializes to JSON', () => {
      const mapSpec = spec(map('string', 'integer'));

      const map_reader = mapSpec.read({ test: 42 });

      assert.json(JSON.stringify(map_reader), { test: 42 });
    });
  });

  context('writer', () => {
    it('serializes to JSON', () => {
      const mapSpec = spec(map('string', 'integer'));

      const map_writer = mapSpec.write({ test: 42 });

      assert.json(JSON.stringify(map_writer), { test: 42 });
    });
  });
});
