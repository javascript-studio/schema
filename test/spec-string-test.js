/*eslint-env mocha*/
'use strict';

const { assert, refute } = require('@sinonjs/referee-sinon');
const { spec } = require('..');

describe('spec string', () => {

  it('validates boolean', () => {
    const schema = spec({ test: 'boolean' });

    refute.exception(() => {
      schema({ test: true });
      schema({ test: false });
    });
    assert.exception(() => {
      schema({ test: 1 });
    }, /TypeError: Expected property "test" to be boolean but got 1/);
    assert.exception(() => {
      schema({ test: 'test' });
    }, /TypeError: Expected property "test" to be boolean but got "test"/);
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
    }, /TypeError: Expected property "test" to be number but got true/);
    assert.exception(() => {
      schema({ test: 'test' });
    }, /TypeError: Expected property "test" to be number but got "test"/);
    assert.exception(() => {
      schema({ test: Infinity });
    }, /TypeError: Expected property "test" to be number but got Infinity/);
    assert.exception(() => {
      schema({ test: NaN });
    }, /TypeError: Expected property "test" to be number but got NaN/);
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
    }, /TypeError: Expected property "test" to be integer but got 1.5/);
    assert.exception(() => {
      schema({ test: true });
    }, /TypeError: Expected property "test" to be integer but got true/);
    assert.exception(() => {
      schema({ test: 'test' });
    }, /TypeError: Expected property "test" to be integer but got "test"/);
    assert.exception(() => {
      schema({ test: Infinity });
    }, /TypeError: Expected property "test" to be integer but got Infinity/);
    assert.exception(() => {
      schema({ test: NaN });
    }, /TypeError: Expected property "test" to be integer but got NaN/);
  });

  it('validates string', () => {
    const schema = spec({ test: 'string' });

    refute.exception(() => {
      schema({ test: '' });
      schema({ test: 'test' });
    });
    assert.exception(() => {
      schema({ test: true });
    }, /TypeError: Expected property "test" to be string but got true/);
    assert.exception(() => {
      schema({ test: 0 });
    }, /TypeError: Expected property "test" to be string but got 0/);
  });

  it('validates object', () => {
    const schema = spec({ test: 'object' });

    refute.exception(() => {
      schema({ test: {} });
    });
    assert.exception(() => {
      schema({ test: null });
    }, /TypeError: Expected property "test" to be object but got null/);
    assert.exception(() => {
      schema({ test: true });
    }, /TypeError: Expected property "test" to be object but got true/);
    assert.exception(() => {
      schema({ test: 'test' });
    }, /TypeError: Expected property "test" to be object but got "test"/);
    assert.exception(() => {
      schema({ test: [] });
    }, /TypeError: Expected property "test" to be object but got \[\]/);
    assert.exception(() => {
      schema({ test: /[a-z]/ });
    }, /TypeError: Expected property "test" to be object but got \/\[a-z\]\//);
  });

  it('fails on unknown string', () => {
    assert.exception(() => {
      spec({ test: 'unknown' });
    }, /Error: Invalid spec "unknown"/);
  });

});
