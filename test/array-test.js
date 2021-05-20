/*eslint-env mocha*/
'use strict';

const { assert, refute } = require('@sinonjs/referee-sinon');
const { spec, array, object, one } = require('..');

describe('array', () => {

  it('requires valid spec argument', () => {
    assert.exception(() => {
      array([]);
    }, {
      name: 'TypeError',
      message: 'Invalid spec []'
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
      schema([]);
    });
    assert.exception(() => {
      schema({});
    }, {
      name: 'TypeError',
      message: 'Expected array but got {}',
      code: 'SCHEMA_VALIDATION'
    });
  });

  it('verifies array as object property', () => {
    const schema = spec({ test: array({ key: true }) });

    refute.exception(() => {
      schema({ test: [] });
    });
    assert.exception(() => {
      schema({ test: 42 });
    }, {
      name: 'TypeError',
      message: 'Expected property "test" to be array but got 42',
      code: 'SCHEMA_VALIDATION'
    });
  });

  it('validates array', () => {
    const validator = array({ test: 'integer' });

    assert.isTrue(validator([]));
    assert.isFalse(validator({}));
  });

  it('validates array as object property', () => {
    const validator = object({ test: array({ key: true }) });

    assert.isTrue(validator({ test: [] }));
    assert.isFalse(validator({ test: 42 }));
  });

  it('verifies array elements', () => {
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
      message: 'Expected property "children.1.name" to be string but got 42',
      code: 'SCHEMA_VALIDATION'
    });
  });

  it('can create array(object({}))', () => {
    refute.exception(() => {
      array(object({}));
    });
  });

  it('can create array("string")', () => {
    let arrayOfStrings;

    refute.exception(() => {
      arrayOfStrings = spec(array('string'));
    });
    refute.exception(() => {
      arrayOfStrings(['foo', '', 'bar', '123']);
    });
    assert.exception(() => {
      arrayOfStrings(['foo', 1]);
    }, {
      name: 'TypeError',
      message: 'Expected property "1" to be string but got 1',
      code: 'SCHEMA_VALIDATION'
    });
  });

  it('can create array(one({ foo: true }, { bar: true }))', () => {
    let arrayOfFooOrBar;

    refute.exception(() => {
      arrayOfFooOrBar = spec(array(one({ foo: true }, { bar: true })));
    });
    refute.exception(() => {
      arrayOfFooOrBar([{ foo: 1 }, { bar: '!' }, { foo: true }, { bar: null }]);
    });
    assert.exception(() => {
      arrayOfFooOrBar([{ foo: 1 }, { doo: '!' }]);
    }, {
      name: 'TypeError',
      message: 'Expected property "1" to be one({foo:true}, {bar:true}) '
        + 'but got {"doo":"!"}',
      code: 'SCHEMA_VALIDATION'
    });
  });

});
