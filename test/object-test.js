/*eslint-env mocha*/
'use strict';

const { assert, refute } = require('@sinonjs/referee-sinon');
const { schema, object } = require('..');

describe('object', () => {
  it('requires object argument', () => {
    assert.exception(
      () => {
        object(() => {});
      },
      {
        name: 'TypeError',
        message: 'Expected object but got function'
      }
    );
    assert.exception(
      () => {
        object([]);
      },
      {
        name: 'TypeError',
        message: 'Expected object but got []'
      }
    );
  });

  it('returns object validator', () => {
    const validator = object({ test: 'integer' });

    assert.isTrue(validator({ test: 1 }));
    assert.isFalse(validator({ test: 1.2 }));
  });

  it('verifies object', () => {
    const objectSchema = schema(object({ test: 'integer' }));

    refute.exception(() => {
      objectSchema({ test: 1 });
    });
    assert.exception(
      () => {
        objectSchema({ test: 1.2 });
      },
      {
        name: 'TypeError',
        message: 'Expected property "test" to be integer but got 1.2',
        code: 'SCHEMA_VALIDATION'
      }
    );
  });

  it('can be used as validator', () => {
    const named = object({ name: 'string' });

    const person = schema(named);

    refute.exception(() => {
      person({ name: 'test' });
    });
    assert.exception(
      () => {
        person({ name: 42 });
      },
      {
        name: 'TypeError',
        message: 'Expected property "name" to be string but got 42',
        code: 'SCHEMA_VALIDATION'
      }
    );
  });

  it('can be used as child validator', () => {
    const child = object({ name: 'string' });

    const parent = schema({ child });

    refute.exception(() => {
      parent({ child: { name: 'test' } });
    });
    assert.exception(
      () => {
        parent({ child: { name: 42 } });
      },
      {
        name: 'TypeError',
        message: 'Expected property "child.name" to be string but got 42',
        code: 'SCHEMA_VALIDATION'
      }
    );
  });
});
