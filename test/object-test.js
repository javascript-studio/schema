/*eslint-env mocha*/
'use strict';

const { assert, refute } = require('@sinonjs/referee-sinon');
const { spec, object } = require('..');

describe('object', () => {

  it('requires object argument', () => {
    assert.exception(() => {
      object(() => {});
    }, /TypeError: Expected object but got function/);
    assert.exception(() => {
      object([]);
    }, /TypeError: Expected object but got \[\]/);
  });

  it('returns object validator', () => {
    const validator = object({ test: 'integer' });

    assert.isTrue(validator({ test: 1 }));
    assert.isFalse(validator({ test: 1.2 }));
  });

  it('verifies object', () => {
    const schema = spec(object({ test: 'integer' }));

    refute.exception(() => {
      schema({ test: 1 });
    });
    assert.exception(() => {
      schema({ test: 1.2 });
    }, /TypeError: Expected property "test" to be integer but got 1.2/);
  });

  it('can be used as validator', () => {
    const named = object({ name: 'string' });

    const person = spec(named);

    refute.exception(() => {
      person({ name: 'test' });
    });
    assert.exception(() => {
      person({ name: 42 });
    }, /TypeError: Expected property "name" to be string but got 42/);
  });

  it('can be used as child validator', () => {
    const child = object({ name: 'string' });

    const parent = spec({ child });

    refute.exception(() => {
      parent({ child: { name: 'test' } });
    });
    assert.exception(() => {
      parent({ child: { name: 42 } });
    }, /TypeError: Expected property "child.name" to be string but got 42/);
  });

});
