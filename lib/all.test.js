'use strict';

const { assert, refute, match } = require('@sinonjs/referee-sinon');
const {
  schema,
  all,
  object,
  boolean,
  number,
  integer,
  string,
  literal,
  validator
} = require('..');

describe('all', () => {
  it('throws if less than two arguments are given', () => {
    assert.exception(
      () => {
        all();
      },
      {
        name: 'Error',
        message: 'Require at least two arguments'
      }
    );
    assert.exception(
      () => {
        all(string);
      },
      {
        name: 'Error',
        message: 'Require at least two arguments'
      }
    );
  });

  it('validates object with two object validators', () => {
    const obj = all(
      object({ foo: integer.min(1) }),
      object({ foo: number.max(2) })
    );

    assert.isTrue(obj({ foo: 1 }));
    assert.isTrue(obj({ foo: 2 }));
    assert.isFalse(obj({ foo: 0 }));
    assert.isFalse(obj({ foo: 3 }));
    assert.isFalse(obj({ foo: 1.5 }));
    // @ts-expect-error
    assert.isFalse(obj({}));
    // @ts-expect-error
    assert.isFalse(obj({ foo: null }));
    // @ts-expect-error
    assert.isFalse(obj({ foo: 'test' }));
    // @ts-expect-error
    assert.isFalse(obj({ bar: 1 }));
  });

  it('validates object with an object and a custom validator', () => {
    const obj = all(
      object({ key: string }),
      validator(() => true)
    );

    assert.isTrue(obj({ key: 'test' }));
    // @ts-expect-error
    assert.isFalse(obj({ key: 42 }));
  });

  it('exposes validators', () => {
    const one = object({ key: string });

    const obj = all(
      one,
      validator(() => true)
    );

    assert.equals(obj.validators, [one, match.func]);
    refute.exception(() => obj.validators[0].verify({ key: 'test' }));
    // @ts-expect-error
    assert.exception(() => obj.validators[0].verify({ key: 42 }), {
      name: 'TypeError',
      message: 'Expected property "key" to be string but got 42'
    });
  });

  it('fails if either of two validators fail', () => {
    const allSchema = schema(all(number.max(-1), number.min(1)));

    assert.exception(
      () => {
        // @ts-expect-error
        allSchema(false);
      },
      {
        name: 'TypeError',
        message: 'Expected all(number <= -1, number >= 1) but got false',
        code: 'E_SCHEMA'
      }
    );
    assert.exception(
      () => {
        allSchema(0);
      },
      {
        name: 'TypeError',
        message: 'Expected all(number <= -1, number >= 1) but got 0',
        code: 'E_SCHEMA'
      }
    );
    assert.exception(
      () => {
        // @ts-expect-error
        allSchema('test');
      },
      {
        name: 'TypeError',
        message: 'Expected all(number <= -1, number >= 1) but got "test"',
        code: 'E_SCHEMA'
      }
    );
  });

  it('fails as part of an object assertion', () => {
    const allSchema = schema(
      object({
        // @ts-expect-error
        key: all(boolean, integer)
      })
    );

    assert.exception(
      () => {
        // @ts-expect-error
        allSchema({ key: 42 });
      },
      {
        name: 'TypeError',
        message:
          'Expected property "key" to be all(boolean, integer) but got 42',
        code: 'E_SCHEMA'
      }
    );
  });

  it('fails null and custom test', () => {
    const allSchema = schema(
      all(
        literal(null),
        validator(() => false)
      )
    );

    assert.exception(
      () => {
        allSchema(null);
      },
      {
        name: 'TypeError',
        message: 'Expected all(null, <custom validator>) but got null'
      }
    );
  });

  it('passes on custom tests', () => {
    const allSchema = schema(
      all(
        validator(() => true),
        validator(() => true)
      )
    );

    refute.exception(() => {
      allSchema(null);
      allSchema('test');
      allSchema({});
    });
  });

  it('fails to access unknown property on reader', () => {
    const allSchema = schema(
      all(
        object({ key: string }),
        validator(() => true)
      )
    );

    const proxy = allSchema.read({ key: 'test' });

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
    const allSchema = schema(
      all(
        object({ key: string }),
        validator(() => true)
      )
    );

    const proxy = allSchema.write({ key: 'test' });

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
    const allSchema = schema(
      all(
        object({ key: string }),
        validator(() => true)
      )
    );

    const proxy = allSchema.write({ key: 'test' });

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
    const allSchema = schema(
      all(
        validator((/** @type {{ key: string }} */ _obj) => true),
        object({ key: string })
      )
    );

    const proxy = allSchema.write({ key: 'test' });

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
    const allSchema = schema(
      all(
        validator(() => true),
        validator(() => true)
      )
    );

    refute.exception(() => {
      allSchema.write({});
    });
  });

  it('fails on two custom validators', () => {
    const allSchema = schema(
      all(
        validator(() => true),
        validator(() => false)
      )
    );

    assert.exception(
      () => {
        allSchema.write({});
      },
      {
        name: 'TypeError',
        message:
          'Expected all(<custom validator>, <custom validator>) but got {}',
        code: 'E_SCHEMA'
      }
    );
  });
});
