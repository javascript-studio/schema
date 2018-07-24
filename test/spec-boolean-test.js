/*eslint-env mocha*/
'use strict';

const { assert, refute } = require('@sinonjs/referee-sinon');
const { spec } = require('..');

describe('spec boolean', () => {

  describe('true', () => {
    const schema = spec({ test: true });

    it('requires the property to be present', () => {
      refute.exception(() => {
        schema({ test: false });
      });
      refute.exception(() => {
        schema({ test: true });
      });
      refute.exception(() => {
        schema({ test: 42 });
      });
      refute.exception(() => {
        schema({ test: null });
      });
      assert.exception(() => {
        schema({});
      }, {
        name: 'TypeError',
        message: 'Expected property "test" to be defined but got undefined',
        code: 'SCHEMA_VALIDATION'
      });
      assert.exception(() => {
        schema({ test: undefined });
      }, {
        name: 'TypeError',
        message: 'Expected property "test" to be defined but got undefined',
        code: 'SCHEMA_VALIDATION'
      });
    });

    it('reader', () => {
      refute.exception(() => {
        schema.read({ test: false });
      });
      refute.exception(() => {
        schema.read({ test: 'thing' });
      });
      assert.exception(() => {
        schema.read({});
      }, {
        name: 'TypeError',
        message: 'Expected property "test" to be defined but got undefined',
        code: 'SCHEMA_VALIDATION'
      });
    });

    it('writer', () => {
      refute.exception(() => {
        schema.verify(schema.write({ test: 42 }));
      });
      assert.exception(() => {
        schema.verify(schema.write({}));
      }, {
        name: 'TypeError',
        message: 'Expected property "test" to be defined but got undefined',
        code: 'SCHEMA_VALIDATION'
      });
    });

  });

  describe('false', () => {
    const schema = spec({ test: false });

    it('does not require the property to be present', () => {
      refute.exception(() => {
        schema({ test: false });
      });
      refute.exception(() => {
        schema({ test: true });
      });
      refute.exception(() => {
        schema({ test: 42 });
      });
      refute.exception(() => {
        schema({ test: null });
      });
      refute.exception(() => {
        schema({});
      });
      refute.exception(() => {
        schema({ test: undefined });
      });
    });

    it('reader', () => {
      refute.exception(() => {
        schema.read({ test: false });
      });
      refute.exception(() => {
        schema.read({ test: 'thing' });
      });
      refute.exception(() => {
        schema.read({});
      });
    });

    it('writer', () => {
      refute.exception(() => {
        schema.verify(schema.write({}));
      });
      refute.exception(() => {
        schema.verify(schema.write({ test: 42 }));
      });
    });
  });

});
