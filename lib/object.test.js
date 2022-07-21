'use strict';

const { assert, refute } = require('@sinonjs/referee-sinon');
const { schema, object, integer, string, one } = require('..');

describe('object', () => {
  it('requires object argument', () => {
    assert.exception(
      () => {
        object(() => {});
      },
      {
        name: 'TypeError',
        message: 'Expected object but got function'
      }
    );
    assert.exception(
      () => {
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
    assert.isFalse(validator({ test: 1.2 }));
  });

  it('exposes original spec', () => {
    const spec = { test: integer };

    const validator = object(spec);

    assert.same(validator.spec, spec);
  });

  it('has type "Object"', () => {
    const validator = object({});

    assert.equals(validator.type, 'Object');
  });

  it('exposes processed properties spec', () => {
    const spec = { int: integer, re: /[a-z]/ };

    const validator = object(spec);

    refute.same(validator.properties, spec);
    assert.same(validator.properties.int, spec.int);
    assert.same(validator.properties.re.type, 'string');
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

    const parent = schema({ child });

    refute.exception(() => {
      parent({ child: { name: 'test' } });
    });
    assert.exception(
      () => {
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
    const person = schema({ name: string });

    assert.exception(
      () => {
        person({ name: 42 }, { error_code: 'INVALID' });
      },
      {
        code: 'INVALID'
      }
    );
  });

  it('reader always returns the same object instance on read', () => {
    const child = object({ name: string });
    const parent = schema({ child });

    const reader = parent.read({ child: { name: 'Test' } });

    assert.same(reader.child, reader.child);
  });

  it('writer always returns the same object instance on read', () => {
    const child = object({ name: string });
    const parent = schema({ child });

    const writer = parent.write({ child: { name: 'Test' } });

    assert.same(writer.child, writer.child);
  });

  it('does not return cached value after set', () => {
    const child = object({ name: string });
    const parent = schema({ child });

    const writer = parent.write({ child: { name: 'Test' } });
    assert.equals(writer.child, { name: 'Test' }); // read the value
    writer.child = { name: 'Updated' };

    assert.equals(writer.child, { name: 'Updated' });
  });

  it('does not fail on reader for property with one(null, ...)', () => {
    const test = schema({ test: one(null, string) });

    const reader = test.read({ test: null });

    refute.exception(() => {
      return reader.test;
    });
  });

  it('does not fail on writer for property with one(null, ...)', () => {
    const test = schema({ test: one(null, string) });

    const writer = test.write({ test: null });

    refute.exception(() => {
      return writer.test;
    });
  });

  it('does not fail on writer for property with one(integer, ...)', () => {
    const test = schema({ test: one(integer, string) });

    const writer = test.write({ test: 1 });

    refute.exception(() => {
      return writer.test;
    });
  });

  it('does not fail on writer for property with one(string, ...)', () => {
    const test = schema({ test: one(string, integer) });

    const writer = test.write({ test: 'test' });

    refute.exception(() => {
      return writer.test;
    });
  });
});
