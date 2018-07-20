/*eslint-env mocha*/
'use strict';

const { assert, refute } = require('@sinonjs/referee-sinon');
const { spec, one } = require('..');

describe('one', () => {

  it('throws if less than two arguments are given', () => {
    assert.exception(() => {
      one();
    }, /Error: Require at least two arguments/);
    assert.exception(() => {
      one('string');
    }, /Error: Require at least two arguments/);
  });

  it('does not fail for either of two specs', () => {
    const schema = spec(one('boolean', 'number'));

    refute.exception(() => {
      schema(true);
      schema(false);
      schema(0);
      schema(1);
    });
  });

  it('fails if none of two specs', () => {
    const schema = spec(one('boolean', 'number'));

    assert.exception(() => {
      schema('test');
    }, /TypeError: Expected one\(boolean, number\) but got "test"/);
  });

  it('fails if none of three specs', () => {
    const schema = spec(one('boolean', 'number', 'string'));

    assert.exception(() => {
      schema({});
    }, /TypeError: Expected one\(boolean, number, string\) but got {}/);
  });

  it('fails as part of an object assertion', () => {
    const schema = spec({
      key: one('boolean', 'integer')
    });

    assert.exception(() => {
      schema({ key: 'test' });
    // eslint-disable-next-line max-len
    }, /TypeError: Expected property "key" to be one\(boolean, integer\) but got "test"/);
  });

  it('fails null or custom test', () => {
    const schema = spec(one(null, () => false));

    assert.exception(() => {
      schema('test');
    }, /TypeError: Expected one\(null, custom value\) but got "test"/);
  });

  it('passes on null or string test', () => {
    const schema = spec(one(null, 'string'));

    refute.exception(() => {
      schema(null);
      schema('test');
    });
  });

  it('passes on custom test', () => {
    const schema = spec(one(() => true, () => {
      throw new Error('Unexpected');
    }));

    refute.exception(() => {
      schema(null);
      schema('test');
      schema({});
    });
  });

  it('fails objects', () => {
    const schema = spec(one({ foo: 'string' }, { bar: 'integer' }));

    assert.exception(() => {
      schema({ foo: true });
    // eslint-disable-next-line max-len
    }, /TypeError: Expected one\({foo:string}, {bar:integer}\) but got {"foo":true}/);
  });

  it('passes objects', () => {
    const schema = spec(one({ foo: 'string' }, { bar: 'integer' }));

    refute.exception(() => {
      schema({ foo: 'test' });
      schema({ bar: 1 });
    });
  });

});
