/*eslint-env mocha*/
'use strict';

const { assert, refute } = require('@sinonjs/referee-sinon');
const { spec } = require('..');

describe('spec string', () => {

  it('validates null', () => {
    const schema = spec({ test: 'null' });

    refute.exception(() => {
      schema({ test: null });
    });
    assert.exception(() => {
      schema({ test: undefined });
    }, {
      name: 'TypeError',
      message: 'Expected property "test" to be null but got undefined',
      code: 'SCHEMA_VALIDATION'
    });
    assert.exception(() => {
      schema({ test: 'test' });
    }, {
      name: 'TypeError',
      message: 'Expected property "test" to be null but got "test"',
      code: 'SCHEMA_VALIDATION'
    });
  });

  it('validates boolean', () => {
    const schema = spec({ test: 'boolean' });

    refute.exception(() => {
      schema({ test: true });
      schema({ test: false });
    });
    assert.exception(() => {
      schema({ test: 1 });
    }, {
      name: 'TypeError',
      message: 'Expected property "test" to be boolean but got 1',
      code: 'SCHEMA_VALIDATION'
    });
    assert.exception(() => {
      schema({ test: 'test' });
    }, {
      name: 'TypeError',
      message: 'Expected property "test" to be boolean but got "test"',
      code: 'SCHEMA_VALIDATION'
    });
  });

  it('validates number', () => {
    const schema = spec({ test: 'number' });

    refute.exception(() => {
      schema({ test: 0 });
      schema({ test: -1 });
      schema({ test: 1 });
      schema({ test: 99999 });
      schema({ test: 1.5 });
    });
    assert.exception(() => {
      schema({ test: true });
    }, {
      name: 'TypeError',
      message: 'Expected property "test" to be number but got true',
      code: 'SCHEMA_VALIDATION'
    });
    assert.exception(() => {
      schema({ test: 'test' });
    }, {
      name: 'TypeError',
      message: 'Expected property "test" to be number but got "test"',
      code: 'SCHEMA_VALIDATION'
    });
    assert.exception(() => {
      schema({ test: Infinity });
    }, {
      name: 'TypeError',
      message: 'Expected property "test" to be number but got Infinity',
      code: 'SCHEMA_VALIDATION'
    });
    assert.exception(() => {
      schema({ test: NaN });
    }, {
      name: 'TypeError',
      message: 'Expected property "test" to be number but got NaN',
      code: 'SCHEMA_VALIDATION'
    });
  });

  it('validates integer', () => {
    const schema = spec({ test: 'integer' });

    refute.exception(() => {
      schema({ test: 0 });
      schema({ test: -1 });
      schema({ test: 1 });
      schema({ test: 99999 });
    });
    assert.exception(() => {
      schema({ test: 1.5 });
    }, {
      name: 'TypeError',
      message: 'Expected property "test" to be integer but got 1.5',
      code: 'SCHEMA_VALIDATION'
    });
    assert.exception(() => {
      schema({ test: true });
    }, {
      name: 'TypeError',
      message: 'Expected property "test" to be integer but got true',
      code: 'SCHEMA_VALIDATION'
    });
    assert.exception(() => {
      schema({ test: 'test' });
    }, {
      name: 'TypeError',
      message: 'Expected property "test" to be integer but got "test"',
      code: 'SCHEMA_VALIDATION'
    });
    assert.exception(() => {
      schema({ test: Infinity });
    }, {
      name: 'TypeError',
      message: 'Expected property "test" to be integer but got Infinity',
      code: 'SCHEMA_VALIDATION'
    });
    assert.exception(() => {
      schema({ test: NaN });
    }, {
      name: 'TypeError',
      message: 'Expected property "test" to be integer but got NaN',
      code: 'SCHEMA_VALIDATION'
    });
  });

  it('validates string', () => {
    const schema = spec({ test: 'string' });

    refute.exception(() => {
      schema({ test: '' });
      schema({ test: 'test' });
    });
    assert.exception(() => {
      schema({ test: true });
    }, {
      name: 'TypeError',
      message: 'Expected property "test" to be string but got true',
      code: 'SCHEMA_VALIDATION'
    });
    assert.exception(() => {
      schema({ test: 0 });
    }, {
      name: 'TypeError',
      message: 'Expected property "test" to be string but got 0',
      code: 'SCHEMA_VALIDATION'
    });
  });

  it('validates object', () => {
    const schema = spec({ test: 'object' });

    refute.exception(() => {
      schema({ test: {} });
    });
    assert.exception(() => {
      schema({ test: null });
    }, {
      name: 'TypeError',
      message: 'Expected property "test" to be object but got null',
      code: 'SCHEMA_VALIDATION'
    });
    assert.exception(() => {
      schema({ test: true });
    }, {
      name: 'TypeError',
      message: 'Expected property "test" to be object but got true',
      code: 'SCHEMA_VALIDATION'
    });
    assert.exception(() => {
      schema({ test: 'test' });
    }, {
      name: 'TypeError',
      message: 'Expected property "test" to be object but got "test"',
      code: 'SCHEMA_VALIDATION'
    });
    assert.exception(() => {
      schema({ test: [] });
    }, {
      name: 'TypeError',
      message: 'Expected property "test" to be object but got []',
      code: 'SCHEMA_VALIDATION'
    });
    assert.exception(() => {
      schema({ test: /[a-z]/ });
    }, {
      name: 'TypeError',
      message: 'Expected property "test" to be object but got /[a-z]/',
      code: 'SCHEMA_VALIDATION'
    });
  });

  it('fails on unknown string', () => {
    assert.exception(() => {
      spec({ test: 'unknown' });
    }, {
      name: 'Error',
      message: 'Invalid spec "unknown"'
    });
  });

  it('returns given object', () => {
    const schema = spec({ test: 'string' });
    const object = { test: 'something' };

    const returned = schema(object);

    assert.same(returned, object);
  });
});
