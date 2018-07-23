/*eslint-env mocha*/
'use strict';

const { assert, refute } = require('@sinonjs/referee-sinon');
const { spec, array, object } = require('..');

describe('array', () => {

  it('requires object argument', () => {
    assert.exception(() => {
      array(() => {});
    }, {
      name: 'TypeError',
      message: 'Expected object but got function'
    });
    assert.exception(() => {
      array([]);
    }, {
      name: 'TypeError',
      message: 'Expected object but got []'
    });
  });

  it('returns array validator', () => {
    const validator = array({ test: 'integer' });

    assert.isTrue(validator([{ test: 1 }]));
    assert.isFalse(validator([{ test: 1.2 }]));
  });

  it('verifies array', () => {
    const schema = spec(array({ test: 'integer' }));

    refute.exception(() => {
      schema([{ test: 1 }]);
    });
    assert.exception(() => {
      schema([{ test: 1.2 }]);
    }, {
      name: 'TypeError',
      message: 'Expected property "0.test" to be integer but got 1.2',
      code: 'SCHEMA_VALIDATION'
    });
  });

  it('can be used as child validator', () => {
    const children = array({ name: 'string' });

    const parent = spec({ children });

    refute.exception(() => {
      parent({ children: [{ name: 'foo' }, { name: 'bar' }] });
    });
    assert.exception(() => {
      parent({ children: [{ name: 'foo' }, { name: 42 }] });
    }, {
      name: 'TypeError',
      message: 'Expected property "children[1].name" to be string but got 42',
      code: 'SCHEMA_VALIDATION'
    });
  });

  it('can create array(object({}))', () => {
    refute.exception(() => {
      array(object({}));
    });
  });

});
