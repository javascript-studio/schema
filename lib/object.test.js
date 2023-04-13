'use strict';

const { assert, refute } = require('@sinonjs/referee-sinon');
const { schema, object, integer, string, literal, one, opt } = require('..');

describe('object', () => {
  it('requires object argument', () => {
    assert.exception(
      () => {
        // @ts-expect-error
        object(() => {});
      },
      {
        name: 'TypeError',
        message: 'Expected object but got function'
      }
    );
    assert.exception(
      () => {
        // @ts-expect-error
        object([]);
      },
      {
        name: 'TypeError',
        message: 'Expected object but got []'
      }
    );
  });

  it('returns object validator', () => {
    const validator = object({ test: integer });

    assert.isTrue(validator({ test: 1 }));
    // @ts-expect-error
    assert.isFalse(validator({}));
    assert.isFalse(validator({ test: 1.2 }));
    // @ts-expect-error
    assert.isFalse(validator({ test: 1, foo: 'test' }));
    // @ts-expect-error
    assert.isFalse(validator({ test: false }));
  });

  it('exposes the properties', () => {
    const properties = { test: integer };

    const validator = object(properties);

    assert.same(validator.properties, properties);
  });

  it('has type "Object"', () => {
    const validator = object({});

    assert.equals(validator.type, 'Object');
  });

  it('validates object', () => {
    const validator = object({ name: string });

    assert.isTrue(validator({ name: '' }));
    assert.isTrue(validator({ name: 'test' }));
    // @ts-expect-error
    assert.isFalse(validator({}));
    // @ts-expect-error
    assert.isFalse(validator({ name: 123 }));
  });

  it('validates nested object with validator', () => {
    const validator = object({ child: object({ name: string }) });

    assert.isTrue(validator({ child: { name: '' } }));
    assert.isTrue(validator({ child: { name: 'test' } }));
    // @ts-expect-error
    assert.isFalse(validator({ child: {} }));
    // @ts-expect-error
    assert.isFalse(validator({ child: { name: 123 } }));
  });

  it('validates object with optional property', () => {
    const test = object({ test: opt(integer) });

    assert.isTrue(test({}));
    assert.isTrue(test({ test: 42 }));
    // @ts-expect-error
    assert.isFalse(test({ test: 'no' }));
  });

  it('validates object with one mandatory and one optional property', () => {
    const test = object({ a: integer, b: opt(integer) });

    assert.isTrue(test({ a: 7 }));
    assert.isTrue(test({ a: 7, b: 42 }));
    // @ts-expect-error
    assert.isFalse(test({ a: 7, test: 'no' }));
    // @ts-expect-error
    assert.isFalse(test({ a: 'no', test: 42 }));
  });

  it('verifies object', () => {
    const objectSchema = schema(object({ test: integer }));

    refute.exception(() => {
      objectSchema({ test: 1 });
    });
    assert.exception(
      () => {
        objectSchema({ test: 1.2 });
      },
      {
        name: 'TypeError',
        message: 'Expected property "test" to be integer but got 1.2',
        code: 'E_SCHEMA'
      }
    );
  });

  it('can be used as validator', () => {
    const named = object({ name: string });

    const person = schema(named);

    refute.exception(() => {
      person({ name: 'test' });
    });
    assert.exception(
      () => {
        // @ts-expect-error
        person({ name: 42 });
      },
      {
        name: 'TypeError',
        message: 'Expected property "name" to be string but got 42',
        code: 'E_SCHEMA'
      }
    );
  });

  it('can be used as child validator', () => {
    const child = object({ name: string });

    const parent = schema(object({ child }));

    refute.exception(() => {
      parent({ child: { name: 'test' } });
    });
    assert.exception(
      () => {
        // @ts-expect-error
        parent({ child: { name: 42 } });
      },
      {
        name: 'TypeError',
        message: 'Expected property "child.name" to be string but got 42',
        code: 'E_SCHEMA'
      }
    );
  });

  it('fails with the given error code', () => {
    const person = schema(object({ name: string }));

    assert.exception(
      () => {
        // @ts-expect-error
        person({ name: 42 }, { error_code: 'INVALID' });
      },
      {
        code: 'INVALID'
      }
    );
  });

  it('reader always returns the same object instance on read', () => {
    const child = object({ name: string });
    const parent = schema(object({ child }));

    const reader = parent.read({ child: { name: 'Test' } });

    assert.same(reader.child, reader.child);
  });

  it('writer always returns the same object instance on read', () => {
    const child = object({ name: string });
    const parent = schema(object({ child }));

    const writer = parent.write({ child: { name: 'Test' } });

    assert.same(writer.child, writer.child);
  });

  it('does not return cached value after set', () => {
    const child = object({ name: string });
    const parent = schema(object({ child }));

    const writer = parent.write({ child: { name: 'Test' } });
    assert.equals(writer.child, { name: 'Test' }); // read the value
    writer.child = { name: 'Updated' };

    assert.equals(writer.child, { name: 'Updated' });
  });

  it('does not fail on reader for property with one(null, ...)', () => {
    const test = schema(object({ test: one(literal(null), string) }));

    const reader = test.read({ test: null });

    refute.exception(() => {
      return reader.test;
    });
  });

  it('does not fail on writer for property with one(null, ...)', () => {
    const test = schema(object({ test: one(literal(null), string) }));

    const writer = test.write({ test: null });

    refute.exception(() => {
      return writer.test;
    });
  });

  it('does not fail on writer for property with one(integer, ...)', () => {
    const test = schema(object({ test: one(integer, string) }));

    const writer = test.write({ test: 1 });

    refute.exception(() => {
      return writer.test;
    });
  });

  it('does not fail on writer for property with one(string, ...)', () => {
    const test = schema(object({ test: one(string, integer) }));

    const writer = test.write({ test: 'test' });

    refute.exception(() => {
      return writer.test;
    });
  });
});
