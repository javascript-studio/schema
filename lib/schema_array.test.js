'use strict';

const { assert, refute } = require('@sinonjs/referee-sinon');
const { schema, string } = require('..');

describe('schema array', () => {
  const arraySchema = schema({ test: [string] });

  it('requires the property to be an array', () => {
    refute.exception(() => {
      arraySchema({ test: [] });
    });
    refute.exception(() => {
      arraySchema({ test: ['yes'] });
    });
    assert.exception(
      () => {
        arraySchema({});
      },
      {
        name: 'TypeError',
        message: 'Missing property "test"',
        code: 'SCHEMA_VALIDATION'
      }
    );
    assert.exception(
      () => {
        arraySchema({ test: 'no' });
      },
      {
        name: 'TypeError',
        message: 'Expected property "test" to be array but got "no"',
        code: 'SCHEMA_VALIDATION'
      }
    );
    assert.exception(
      () => {
        arraySchema({ test: [42] });
      },
      {
        name: 'TypeError',
        message: 'Expected property "test[0]" to be string but got 42',
        code: 'SCHEMA_VALIDATION'
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
        arraySchema.read({});
      },
      {
        name: 'TypeError',
        message: 'Missing property "test"',
        code: 'SCHEMA_VALIDATION'
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
        code: 'SCHEMA_VALIDATION'
      }
    );
  });
});
