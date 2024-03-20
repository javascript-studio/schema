'use strict';

const { assert, refute, sinon } = require('@sinonjs/referee-sinon');
const { schema, object, boolean } = require('./index');

/**
 * @template I
 * @typedef {import('./index').Infer<I>} Infer
 */

describe('schema', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('returns a function with read, write and verify', () => {
    const validate = schema(object({}));

    assert.isFunction(validate);
    assert.isFunction(validate.read);
    assert.isFunction(validate.write);
    assert.isFunction(validate.verify);
  });

  it('exposes type Object for object validator', () => {
    const test = object({ test: schema.number });

    const validate = schema(test);

    assert.same(validate.type, 'Object');
    assert.equals(validate.properties, { test: schema.number });
    // @ts-expect-error
    assert.isUndefined(validate.items);
  });

  it('exposes type Array', () => {
    const test = schema.array(schema.number);

    const validate = schema(test);

    assert.same(validate.type, 'Array');
    assert.same(validate.items, schema.number);
    // @ts-expect-error
    assert.isUndefined(validate.properties);
  });

  it('exposes type number', () => {
    const validate = schema(schema.number);

    assert.same(validate.type, 'number');
    // @ts-expect-error
    assert.isUndefined(validate.properties);
    // @ts-expect-error
    assert.isUndefined(validate.items);
  });

  it('exposes type string', () => {
    const validate = schema(schema.string);

    assert.same(validate.type, 'string');
  });

  it('does not invoke the given validator property accessors', () => {
    const obj = schema.object({});
    const read = sinon.replaceGetter(obj['verify'], 'read', sinon.fake());
    const write = sinon.replaceGetter(obj['verify'], 'write', sinon.fake());

    schema(obj);

    refute.called(read);
    refute.called(write);
  });

  it('returns the validated object', () => {
    const validate = schema(object({ test: boolean }));

    const result = validate({ test: true });

    assert.isObject(result);
    assert.isTrue(result.test); // shouldn't file type check
  });

  it('fails with default error code', () => {
    const validate = schema(object({}));

    assert.exception(
      () => {
        // @ts-expect-error
        validate(null);
      },
      { code: 'E_SCHEMA' }
    );
  });

  it('fails with error code from schema option', () => {
    const validate = schema(object({}), { error_code: 'INVALID' });

    assert.exception(
      () => {
        // @ts-expect-error
        validate(null);
      },
      { code: 'INVALID' }
    );
  });

  it('fails in reader with error code from schema option', () => {
    const validate = schema(object({ test: boolean }), {
      error_code: 'INVALID'
    });

    assert.exception(
      () => {
        // @ts-expect-error
        validate.read(null);
      },
      { code: 'INVALID' }
    );
    const valid = validate.read({ test: true });
    assert.exception(
      () => {
        // @ts-expect-error
        return valid.invalid;
      },
      { code: 'INVALID' }
    );
  });

  it('fails in writer with error code from schema option', () => {
    const validate = schema(object({}), { error_code: 'INVALID' });

    assert.exception(
      () => {
        // @ts-expect-error
        validate.write(null);
      },
      { code: 'INVALID' }
    );
  });

  context('Infer', () => {
    it('creates a type with Infer for a validator', () => {
      /* eslint-disable-next-line jsdoc/no-undefined-types */
      /** @typedef {Infer<validate>} Test */
      const validate = object({ test: boolean });

      assert.isTrue(validate(/** @type {Test} */ ({ test: true })));
      assert.isFalse(
        validate(
          // @ts-expect-error
          /** @type {Test} */ ({
            test: 'test'
          })
        )
      );
    });

    it('creates a type with Infer for a schema', () => {
      /* eslint-disable-next-line jsdoc/no-undefined-types */
      /** @typedef {Infer<validate>} Test */
      const validate = schema(object({ test: boolean }));

      assert.equals(validate({ test: true }), { test: true });
      assert.exception(() =>
        validate(
          // @ts-expect-error
          /** @type {Test} */ ({
            test: 'test'
          })
        )
      );
    });
  });
});
