'use strict';

const { assert, refute } = require('@sinonjs/referee-sinon');
const { schema, defined } = require('..');

describe('schema defined', () => {
  const trueSchema = schema({ test: defined });

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
