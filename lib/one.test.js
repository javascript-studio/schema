'use strict';

const { assert, refute } = require('@sinonjs/referee-sinon');
const {
  schema,
  object,
  one,
  boolean,
  number,
  integer,
  string,
  literal,
  validator
} = require('..');

describe('one', () => {
  it('returns false if value does not match', () => {
    const oneValidator = one(boolean, number);

    // @ts-expect-error
    assert.isFalse(oneValidator('test'));
    // @ts-expect-error
    assert.isFalse(oneValidator({}));
    // @ts-expect-error
    assert.isFalse(oneValidator([]));
  });

  it('returns true if value matches', () => {
    const oneValidator = one(boolean, number);

    assert.isTrue(oneValidator(true));
    assert.isTrue(oneValidator(false));
    assert.isTrue(oneValidator(0));
    assert.isTrue(oneValidator(42));
  });

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
        one(string);
      },
      {
        name: 'Error',
        message: 'Require at least two arguments'
      }
    );
  });

  it('validates object with two object validators', () => {
    const obj = one(object({ foo: number }), object({ bar: number }));

    assert.isTrue(obj({ bar: 2 }));
    assert.isTrue(obj({ foo: 2 }));
    assert.isFalse(obj({ foo: 1, bar: 2 }));
    // @ts-expect-error
    assert.isFalse(obj({}));
    // @ts-expect-error
    assert.isFalse(obj({ foo: 1, bar: 'test' }));
  });

  it('validates object with an object and a custom validator', () => {
    const obj = one(
      object({ key: string }),
      validator(() => false)
    );

    assert.isTrue(obj({ key: 'test' }));
    assert.isFalse(obj({ key: 42 }));
  });

  it('does not fail for either of two validators', () => {
    const oneSchema = schema(one(boolean, number));

    refute.exception(() => {
      oneSchema(true);
      oneSchema(false);
      oneSchema(0);
      oneSchema(1);
    });
  });

  it('fails if none of two validators', () => {
    const oneSchema = schema(one(boolean, number));

    assert.exception(
      () => {
        // @ts-expect-error
        oneSchema('test');
      },
      {
        name: 'TypeError',
        message: 'Expected one(boolean, number) but got "test"',
        code: 'E_SCHEMA'
      }
    );
  });

  it('fails if none of three validators', () => {
    const oneSchema = schema(one(boolean, number, string));

    assert.exception(
      () => {
        // @ts-expect-error
        oneSchema({});
      },
      {
        name: 'TypeError',
        message: 'Expected one(boolean, number, string) but got {}',
        code: 'E_SCHEMA'
      }
    );
  });

  it('fails as part of an object assertion', () => {
    const oneSchema = schema(
      object({
        key: one(boolean, integer)
      })
    );

    assert.exception(
      () => {
        // @ts-expect-error
        oneSchema({ key: 'test' });
      },
      {
        name: 'TypeError',
        message:
          'Expected property "key" to be one(boolean, integer) but got ' +
          '"test"',
        code: 'E_SCHEMA'
      }
    );
  });

  it('fails null or custom test', () => {
    const oneSchema = schema(
      one(
        literal(null),
        validator(() => false)
      )
    );

    assert.exception(
      () => {
        oneSchema('test');
      },
      {
        name: 'TypeError',
        message: 'Expected one(null, <custom validator>) but got "test"',
        code: 'E_SCHEMA'
      }
    );
  });

  it('passes on null or string test', () => {
    const oneSchema = schema(one(literal(null), string));

    refute.exception(() => {
      oneSchema(null);
      oneSchema('test');
    });
  });

  it('passes on custom test', () => {
    const oneSchema = schema(
      one(
        validator(() => true),
        validator(() => {
          throw new Error('Unexpected');
        })
      )
    );

    refute.exception(() => {
      oneSchema(null);
      oneSchema('test');
      oneSchema({});
    });
  });

  it('fails validator', () => {
    const oneSchema = schema(one(literal(null), object({ bar: integer })));

    assert.exception(
      () => {
        // @ts-expect-error
        oneSchema({ foo: true });
      },
      {
        name: 'TypeError',
        message: 'Expected one(null, {bar:integer}) but got {"foo":true}',
        code: 'E_SCHEMA'
      }
    );
  });

  it('fails with given error code', () => {
    const oneSchema = schema(one(literal(null), object({ bar: integer })));

    assert.exception(
      () => {
        // @ts-expect-error
        oneSchema({ foo: true }, { error_code: 'INVALID' });
      },
      {
        code: 'INVALID'
      }
    );
  });

  it('fails with given error code for reader', () => {
    const oneSchema = schema(one(literal(null), object({ bar: integer })));

    assert.exception(
      () => {
        // @ts-expect-error
        oneSchema.read({ foo: true }, { error_code: 'INVALID' });
      },
      {
        code: 'INVALID'
      }
    );
  });

  it('fails with error code from schema', () => {
    const oneSchema = schema(one(literal(null), object({ bar: integer })), {
      error_code: 'INVALID'
    });

    assert.exception(
      () => {
        // @ts-expect-error
        oneSchema({ foo: true });
      },
      {
        code: 'INVALID'
      }
    );
  });

  it.skip('fails with error code from schema for reader', () => {
    const oneSchema = schema(one(literal(null), object({ bar: integer })), {
      error_code: 'INVALID'
    });

    assert.exception(
      () => {
        // @ts-expect-error
        oneSchema.read({ foo: true });
      },
      {
        code: 'INVALID'
      }
    );
  });

  it('passes validator', () => {
    const oneSchema = schema(one(literal(null), object({ bar: integer })));

    refute.exception(() => {
      oneSchema(null);
      oneSchema({ bar: 1 });
    });
  });

  it('fails to access unknown property on reader', () => {
    const oneSchema = schema(
      one(object({ this: string }), object({ that: integer }))
    );

    const proxy = oneSchema.read({ this: 'test' });

    assert.exception(
      () => {
        // @ts-expect-error
        return proxy.foo;
      },
      {
        name: 'ReferenceError',
        message: 'Invalid property "foo"',
        code: 'E_SCHEMA'
      }
    );
  });

  it('fails to access unknown property on writer', () => {
    const oneSchema = schema(
      one(object({ this: string }), object({ that: integer }))
    );

    const proxy = oneSchema.write({ that: 42 });

    assert.exception(
      () => {
        // @ts-expect-error
        return proxy.foo;
      },
      {
        name: 'ReferenceError',
        message: 'Invalid property "foo"',
        code: 'E_SCHEMA'
      }
    );
  });

  it('fails to assign property on writer', () => {
    const oneSchema = schema(
      one(
        object({ key: string }),
        validator(() => true)
      )
    );

    const proxy = oneSchema.write({ key: 'test' });

    assert.exception(
      () => {
        // @ts-expect-error
        proxy.key = 11;
      },
      {
        name: 'TypeError',
        message: 'Expected property "key" to be string but got 11',
        code: 'E_SCHEMA'
      }
    );
  });

  it('fails to assign property on writer (with custom validator first)', () => {
    const oneSchema = schema(
      one(
        validator(() => true),
        object({ key: string })
      )
    );

    const proxy = oneSchema.write({ key: 'test' });

    assert.exception(
      () => {
        // @ts-expect-error
        proxy.key = 11;
      },
      {
        name: 'TypeError',
        message: 'Expected property "key" to be string but got 11',
        code: 'E_SCHEMA'
      }
    );
  });

  it('succeeds on two custom validators', () => {
    const oneSchema = schema(
      one(
        validator(() => false),
        validator(() => true)
      )
    );

    refute.exception(() => {
      oneSchema.write({});
    });
  });

  it('fails on two custom validators', () => {
    const oneSchema = schema(
      one(
        validator(() => false),
        validator(() => false)
      )
    );

    assert.exception(
      () => {
        oneSchema.write({});
      },
      {
        name: 'TypeError',
        message:
          'Expected one(<custom validator>, <custom validator>) but got {}',
        code: 'E_SCHEMA'
      }
    );
  });

  it('succeeds on one(null, { test: integer })', () => {
    const oneSchema = schema(one(literal(null), object({ test: integer })));

    refute.exception(() => {
      oneSchema.write(null);
    });
    refute.exception(() => {
      oneSchema.write({ test: 1 });
    });
  });
});
