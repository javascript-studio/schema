'use strict';

const { assert, refute } = require('@sinonjs/referee-sinon');
const { schema, defined, object } = require('..');

describe('schema defined', () => {
  const trueSchema = schema(object({ test: defined }));

  it('requires the property to be present', () => {
    refute.exception(() => {
      trueSchema({ test: false });
    });
    refute.exception(() => {
      trueSchema({ test: true });
    });
    refute.exception(() => {
      trueSchema({ test: 42 });
    });
    refute.exception(() => {
      trueSchema({ test: null });
    });
    assert.exception(
      () => {
        // @ts-expect-error
        trueSchema({});
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
        trueSchema({ test: undefined });
      },
      {
        name: 'TypeError',
        message: 'Missing property "test"',
        code: 'E_SCHEMA'
      }
    );
  });

  it('reader', () => {
    refute.exception(() => {
      trueSchema.read({ test: false });
    });
    refute.exception(() => {
      trueSchema.read({ test: 'thing' });
    });
    assert.exception(
      () => {
        // @ts-expect-error
        trueSchema.read({});
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
      trueSchema.verify(trueSchema.write({ test: 42 }));
    });
    assert.exception(
      () => {
        trueSchema.verify(trueSchema.write({}));
      },
      {
        name: 'TypeError',
        message: 'Missing property "test"',
        code: 'E_SCHEMA'
      }
    );
  });
});
