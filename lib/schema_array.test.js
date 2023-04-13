'use strict';

const { assert, refute } = require('@sinonjs/referee-sinon');
const { schema, array, object, string } = require('..');

describe('schema array', () => {
  const arraySchema = schema(object({ test: array(string) }));

  it('requires the property to be an array', () => {
    refute.exception(() => {
      arraySchema({ test: [] });
    });
    refute.exception(() => {
      arraySchema({ test: ['yes'] });
    });
    assert.exception(
      () => {
        // @ts-expect-error
        arraySchema({});
      },
      {
        name: 'TypeError',
        message: 'Missing property "test"',
        code: 'E_SCHEMA'
      }
    );
    assert.exception(
      () => {
        // @ts-expect-error
        arraySchema({ test: 'no' });
      },
      {
        name: 'TypeError',
        message: 'Expected property "test" to be array but got "no"',
        code: 'E_SCHEMA'
      }
    );
    assert.exception(
      () => {
        // @ts-expect-error
        arraySchema({ test: [42] });
      },
      {
        name: 'TypeError',
        message: 'Expected property "test[0]" to be string but got 42',
        code: 'E_SCHEMA'
      }
    );
  });

  it('reader', () => {
    refute.exception(() => {
      arraySchema.read({ test: [] });
    });
    refute.exception(() => {
      arraySchema.read({ test: ['yes'] });
    });
    assert.exception(
      () => {
        // @ts-expect-error
        arraySchema.read({});
      },
      {
        name: 'TypeError',
        message: 'Missing property "test"',
        code: 'E_SCHEMA'
      }
    );
  });

  it('writer', () => {
    refute.exception(() => {
      arraySchema.verify(arraySchema.write({ test: [] }));
    });
    assert.exception(
      () => {
        arraySchema.verify(arraySchema.write({}));
      },
      {
        name: 'TypeError',
        message: 'Missing property "test"',
        code: 'E_SCHEMA'
      }
    );
  });
});
