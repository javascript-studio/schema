/*eslint-env mocha*/
'use strict';

const { assert, refute } = require('@sinonjs/referee-sinon');
const { schema, object, one } = require('..');

describe('one', () => {
  it('throws if less than two arguments are given', () => {
    assert.exception(
      () => {
        one();
      },
      {
        name: 'Error',
        message: 'Require at least two arguments'
      }
    );
    assert.exception(
      () => {
        one('string');
      },
      {
        name: 'Error',
        message: 'Require at least two arguments'
      }
    );
  });

  it('does not fail for either of two specs', () => {
    const oneSchema = schema(one('boolean', 'number'));

    refute.exception(() => {
      oneSchema(true);
      oneSchema(false);
      oneSchema(0);
      oneSchema(1);
    });
  });

  it('fails if none of two specs', () => {
    const oneSchema = schema(one('boolean', 'number'));

    assert.exception(
      () => {
        oneSchema('test');
      },
      {
        name: 'TypeError',
        message: 'Expected one(boolean, number) but got "test"',
        code: 'SCHEMA_VALIDATION'
      }
    );
  });

  it('fails if none of three specs', () => {
    const oneSchema = schema(one('boolean', 'number', 'string'));

    assert.exception(
      () => {
        oneSchema({});
      },
      {
        name: 'TypeError',
        message: 'Expected one(boolean, number, string) but got {}',
        code: 'SCHEMA_VALIDATION'
      }
    );
  });

  it('fails as part of an object assertion', () => {
    const oneSchema = schema({
      key: one('boolean', 'integer')
    });

    assert.exception(
      () => {
        oneSchema({ key: 'test' });
      },
      {
        name: 'TypeError',
        message:
          'Expected property "key" to be one(boolean, integer) but got ' +
          '"test"',
        code: 'SCHEMA_VALIDATION'
      }
    );
  });

  it('fails null or custom test', () => {
    const oneSchema = schema(one(null, () => false));

    assert.exception(
      () => {
        oneSchema('test');
      },
      {
        name: 'TypeError',
        message: 'Expected one(null, custom value) but got "test"',
        code: 'SCHEMA_VALIDATION'
      }
    );
  });

  it('passes on null or string test', () => {
    const oneSchema = schema(one(null, 'string'));

    refute.exception(() => {
      oneSchema(null);
      oneSchema('test');
    });
  });

  it('passes on custom test', () => {
    const oneSchema = schema(
      one(
        () => true,
        () => {
          throw new Error('Unexpected');
        }
      )
    );

    refute.exception(() => {
      oneSchema(null);
      oneSchema('test');
      oneSchema({});
    });
  });

  it('fails objects', () => {
    const oneSchema = schema(one({ foo: 'string' }, { bar: 'integer' }));

    assert.exception(
      () => {
        oneSchema({ foo: true });
      },
      {
        name: 'TypeError',
        message:
          'Expected one({foo:string}, {bar:integer}) but got {"foo":true}',
        code: 'SCHEMA_VALIDATION'
      }
    );
  });

  it('passes objects', () => {
    const oneSchema = schema(one({ foo: 'string' }, { bar: 'integer' }));

    refute.exception(() => {
      oneSchema({ foo: 'test' });
      oneSchema({ bar: 1 });
    });
  });

  it('fails validator', () => {
    const validator = object({ bar: 'integer' });
    const oneSchema = schema(one(null, validator));

    assert.exception(
      () => {
        oneSchema({ foo: true });
      },
      {
        name: 'TypeError',
        message: 'Expected one(null, {bar:integer}) but got {"foo":true}',
        code: 'SCHEMA_VALIDATION'
      }
    );
  });

  it('passes validator', () => {
    const validator = object({ bar: 'integer' });
    const oneSchema = schema(one(null, validator));

    refute.exception(() => {
      oneSchema(null);
      oneSchema({ bar: 1 });
    });
  });
});
