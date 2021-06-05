/*eslint-env mocha*/
'use strict';

const { assert, refute } = require('@sinonjs/referee-sinon');
const { schema } = require('..');

describe('spec boolean', () => {
  describe('true', () => {
    const trueSchema = schema({ test: true });

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
          message: 'Expected property "test" to be defined but got undefined',
          code: 'SCHEMA_VALIDATION'
        }
      );
      assert.exception(
        () => {
          trueSchema({ test: undefined });
        },
        {
          name: 'TypeError',
          message: 'Expected property "test" to be defined but got undefined',
          code: 'SCHEMA_VALIDATION'
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
          message: 'Expected property "test" to be defined but got undefined',
          code: 'SCHEMA_VALIDATION'
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
          message: 'Expected property "test" to be defined but got undefined',
          code: 'SCHEMA_VALIDATION'
        }
      );
    });
  });

  describe('false', () => {
    const falseSchema = schema({ test: false });

    it('does not require the property to be present', () => {
      refute.exception(() => {
        falseSchema({ test: false });
      });
      refute.exception(() => {
        falseSchema({ test: true });
      });
      refute.exception(() => {
        falseSchema({ test: 42 });
      });
      refute.exception(() => {
        falseSchema({ test: null });
      });
      refute.exception(() => {
        falseSchema({});
      });
      refute.exception(() => {
        falseSchema({ test: undefined });
      });
    });

    it('reader', () => {
      refute.exception(() => {
        falseSchema.read({ test: false });
      });
      refute.exception(() => {
        falseSchema.read({ test: 'thing' });
      });
      refute.exception(() => {
        falseSchema.read({});
      });
    });

    it('writer', () => {
      refute.exception(() => {
        falseSchema.verify(falseSchema.write({}));
      });
      refute.exception(() => {
        falseSchema.verify(falseSchema.write({ test: 42 }));
      });
    });
  });
});
