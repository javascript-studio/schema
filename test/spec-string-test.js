/*eslint-env mocha*/
'use strict';

const { assert, refute } = require('@sinonjs/referee-sinon');
const { spec } = require('..');

describe('spec string', () => {

  it('validates boolean', () => {
    const schema = spec('boolean');

    refute.exception(() => {
      schema(true);
      schema(false);
    });
    assert.exception(() => {
      schema(1);
    }, /TypeError: Expected boolean but got 1/);
    assert.exception(() => {
      schema('test');
    }, /TypeError: Expected boolean but got "test"/);
  });

  it('validates number', () => {
    const schema = spec('number');

    refute.exception(() => {
      schema(0);
      schema(-1);
      schema(1);
      schema(99999);
      schema(1.5);
    });
    assert.exception(() => {
      schema(true);
    }, /TypeError: Expected number but got true/);
    assert.exception(() => {
      schema('test');
    }, /TypeError: Expected number but got "test"/);
    assert.exception(() => {
      schema(Infinity);
    }, /TypeError: Expected number but got Infinity/);
    assert.exception(() => {
      schema(NaN);
    }, /TypeError: Expected number but got NaN/);
  });

  it('validates integer', () => {
    const schema = spec('integer');

    refute.exception(() => {
      schema(0);
      schema(-1);
      schema(1);
      schema(99999);
    });
    assert.exception(() => {
      schema(1.5);
    }, /TypeError: Expected integer but got 1.5/);
    assert.exception(() => {
      schema(true);
    }, /TypeError: Expected integer but got true/);
    assert.exception(() => {
      schema('test');
    }, /TypeError: Expected integer but got "test"/);
    assert.exception(() => {
      schema(Infinity);
    }, /TypeError: Expected integer but got Infinity/);
    assert.exception(() => {
      schema(NaN);
    }, /TypeError: Expected integer but got NaN/);
  });

  it('validates string', () => {
    const schema = spec('string');

    refute.exception(() => {
      schema('');
      schema('test');
    });
    assert.exception(() => {
      schema(true);
    }, /TypeError: Expected string but got true/);
    assert.exception(() => {
      schema(0);
    }, /TypeError: Expected string but got 0/);
  });

  it('validates object', () => {
    const schema = spec('object');

    refute.exception(() => {
      schema({});
      schema([]);
    });
    assert.exception(() => {
      schema(null);
    }, /TypeError: Expected object but got null/);
    assert.exception(() => {
      schema(true);
    }, /TypeError: Expected object but got true/);
    assert.exception(() => {
      schema('test');
    }, /TypeError: Expected object but got "test"/);
  });

  it('fails on unknown string', () => {
    assert.exception(() => {
      spec('unknown');
    }, /Error: Invalid spec "unknown"/);
  });

});
