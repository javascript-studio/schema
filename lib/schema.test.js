'use strict';

const { assert, refute, sinon } = require('@sinonjs/referee-sinon');
const { schema } = require('./schema');

describe('schema', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('returns a function with read, write and verify', () => {
    const validate = schema({});

    assert.isFunction(validate);
    assert.isFunction(validate.read);
    assert.isFunction(validate.write);
    assert.isFunction(validate.verify);
  });

  it('does not invoke the given validator property accessors', () => {
    const object = schema.object({});
    const read = sinon.replaceGetter(object.verify, 'read', sinon.fake());
    const write = sinon.replaceGetter(object.verify, 'write', sinon.fake());

    schema(object);

    refute.called(read);
    refute.called(write);
  });

  it('fails with default error code', () => {
    const validate = schema({});

    assert.exception(
      () => {
        validate(null);
      },
      { code: 'E_SCHEMA' }
    );
  });

  it('fails with error code from schema option', () => {
    const validate = schema({}, { error_code: 'INVALID' });

    assert.exception(
      () => {
        validate(null);
      },
      { code: 'INVALID' }
    );
  });

  it('fails in reader with error code from schema option', () => {
    const validate = schema({}, { error_code: 'INVALID' });

    assert.exception(
      () => {
        validate.read(null);
      },
      { code: 'INVALID' }
    );
    const valid = validate.read({});
    assert.exception(
      () => {
        return valid.invalid;
      },
      { code: 'INVALID' }
    );
  });

  it('fails in writer with error code from schema option', () => {
    const validate = schema({}, { error_code: 'INVALID' });

    assert.exception(
      () => {
        validate.write(null);
      },
      { code: 'INVALID' }
    );
  });
});
