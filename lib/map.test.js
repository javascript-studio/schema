'use strict';

const { assert, refute } = require('@sinonjs/referee-sinon');
const {
  schema,
  map,
  opt,
  one,
  boolean,
  number,
  integer,
  string,
  object,
  literal
} = require('..');

describe('map', () => {
  it('has type "Map"', () => {
    const validator = map(string, string);

    assert.equals(validator.type, 'Map');
  });

  it('exposes keyTest as keys', () => {
    const keyTest = string.regexp(/[a-z]/);

    const validator = map(keyTest, string);

    assert.same(validator.keys, keyTest);
  });

  it('exposes valueTest as values', () => {
    const valueTest = string.regexp(/[a-z]/);

    const validator = map(string, valueTest);

    assert.same(validator.values, valueTest);
  });

  it('requires both arguments to be validators', () => {
    assert.exception(
      () => {
        // @ts-expect-error
        map();
      },
      {
        name: 'Error',
        message: 'Invalid validator undefined'
      }
    );
    assert.exception(
      () => {
        // @ts-expect-error
        map(string);
      },
      {
        name: 'Error',
        message: 'Invalid validator undefined'
      }
    );
    assert.exception(
      () => {
        // @ts-expect-error
        map(string, 'unknown');
      },
      {
        name: 'Error',
        message: 'Invalid validator "unknown"'
      }
    );
  });

  it('validates objects', () => {
    const mapNumber = map(string, number);

    assert.isTrue(mapNumber({}));
    assert.isTrue(mapNumber({ 0: 0 }));
    assert.isTrue(mapNumber({ foo: 1 }));
    // @ts-expect-error
    assert.isFalse(mapNumber(null));
    // @ts-expect-error
    assert.isFalse(mapNumber({ foo: false }));
    // @ts-expect-error
    assert.isFalse(mapNumber({ foo: 'test' }));
  });

  it('validates object values', () => {
    const mapNumber = map(string, object({ bar: boolean }));

    assert.isTrue(mapNumber({ foo: { bar: true } }));
    // @ts-expect-error
    assert.isFalse(mapNumber({ foo: {} }));
    // @ts-expect-error
    assert.isFalse(mapNumber({ foo: false }));
    // @ts-expect-error
    assert.isFalse(mapNumber({ foo: 'test' }));
    // @ts-expect-error
    assert.isFalse(mapNumber({ foo: [] }));
  });

  it('does not fail for valid objects', () => {
    const mapSchema = schema(map(string, number));

    refute.exception(() => {
      mapSchema({});
      mapSchema({ 0: 0 });
      mapSchema({ foo: 1 });
      mapSchema({ bar: 2 });
    });
  });

  it('fails for non-objects', () => {
    const mapSchema = schema(map(string, number));

    assert.exception(
      () => {
        // @ts-expect-error
        mapSchema([]);
      },
      {
        name: 'TypeError',
        message: 'Expected object but got []',
        code: 'E_SCHEMA'
      }
    );
    assert.exception(
      () => {
        // @ts-expect-error
        mapSchema('test');
      },
      {
        name: 'TypeError',
        message: 'Expected object but got "test"',
        code: 'E_SCHEMA'
      }
    );
  });

  it('fails for invalid keys', () => {
    const mapSchema = schema(map(string.regexp(/^[a-z]$/), string));

    assert.exception(
      () => {
        mapSchema({ 0: 'ok' });
      },
      {
        name: 'TypeError',
        message: 'Expected key "0" to be string matching /^[a-z]$/',
        code: 'E_SCHEMA'
      }
    );
    assert.exception(
      () => {
        mapSchema({ abc: 'ok' });
      },
      {
        name: 'TypeError',
        message: 'Expected key "abc" to be string matching /^[a-z]$/',
        code: 'E_SCHEMA'
      }
    );
  });

  it('supports integer keys', () => {
    const mapSchema = schema(map(integer, string));

    refute.exception(() => {
      mapSchema({ 0: 'ok' });
    });
  });

  it('supports integer keys with range', () => {
    const mapSchema = schema(map(integer.range(0, 6), string));

    refute.exception(() => {
      mapSchema({ 0: 'ok' });
    });
  });

  it('fails if integer key is not an integer', () => {
    const mapSchema = schema(map(integer, string));

    assert.exception(
      () => {
        mapSchema({ 0.2: 'ok' });
      },
      {
        name: 'TypeError',
        message: 'Expected key "0.2" to be an integer string',
        code: 'E_SCHEMA'
      }
    );
  });

  it('supports integer keys in validator', () => {
    const mapValidator = map(integer, string);

    assert.isTrue(mapValidator({ 0: 'passes' }));
    // @ts-expect-error
    assert.isFalse(mapValidator({ test: 'fails' }));
  });

  it('supports literal keys', () => {
    const mapSchema = schema(map(literal('a', 'b'), string));

    refute.exception(() => {
      mapSchema({ a: 'A' });
    });
    refute.exception(() => {
      mapSchema({ b: 'B' });
    });
    refute.exception(() => {
      mapSchema({ a: 'A', b: 'B' });
    });
  });

  it('fails if literal key is not a match', () => {
    const mapSchema = schema(map(literal('a', 'b'), string));

    assert.exception(
      () => {
        mapSchema({ c: 'C' });
      },
      {
        name: 'TypeError',
        message: 'Expected key "c" to be "a" or "b"',
        code: 'E_SCHEMA'
      }
    );
  });

  it('fails for invalid objects', () => {
    const mapSchema = schema(map(string, number));

    assert.exception(
      () => {
        // @ts-expect-error
        mapSchema({ foo: true });
      },
      {
        name: 'TypeError',
        message: 'Expected property "foo" to be number but got true',
        code: 'E_SCHEMA'
      }
    );
  });

  it('validates value object', () => {
    const mapSchema = schema(map(string, object({ index: number })));

    assert.exception(
      () => {
        // @ts-expect-error
        mapSchema({ foo: { index: 'invalid' } });
      },
      {
        name: 'TypeError',
        message: 'Expected property "foo.index" to be number but got "invalid"',
        code: 'E_SCHEMA'
      }
    );
  });

  it('works within `opt`', () => {
    const mapSchema = schema(opt(map(string, number)));

    refute.exception(() => {
      mapSchema(undefined);
      mapSchema({});
      mapSchema({ foo: 0 });
    });
    assert.exception(
      () => {
        // @ts-expect-error
        mapSchema({ foo: '' });
      },
      {
        name: 'TypeError',
        message: 'Expected property "foo" to be number but got ""',
        code: 'E_SCHEMA'
      }
    );
  });

  it('works within `one`', () => {
    const mapSchema = schema(one(boolean, map(string, number)));

    refute.exception(() => {
      mapSchema(true);
      mapSchema(false);
      mapSchema({});
      mapSchema({ foo: 0 });
    });
    assert.exception(
      () => {
        // @ts-expect-error
        mapSchema('something');
      },
      {
        name: 'TypeError',
        message: 'Expected one(boolean, {string:number}) but got "something"',
        code: 'E_SCHEMA'
      }
    );
    assert.exception(
      () => {
        // @ts-expect-error
        mapSchema({ foo: '' });
      },
      {
        name: 'TypeError',
        message: 'Expected one(boolean, {string:number}) but got {"foo":""}',
        code: 'E_SCHEMA'
      }
    );
  });

  it('works using `opt`', () => {
    const mapSchema = schema(map(string, opt(number)));

    refute.exception(() => {
      mapSchema({});
      mapSchema({ foo: undefined });
      mapSchema({ foo: 1 });
    });
    assert.exception(
      () => {
        // @ts-expect-error
        mapSchema({ foo: null });
      },
      {
        name: 'TypeError',
        message: 'Expected property "foo" to be number but got null',
        code: 'E_SCHEMA'
      }
    );
  });

  it('works using `one`', () => {
    const mapSchema = schema(map(string, one(boolean, number)));

    refute.exception(() => {
      mapSchema({});
      mapSchema({ foo: 0 });
      mapSchema({ foo: true });
      mapSchema({ foo: false });
    });
    assert.exception(
      () => {
        // @ts-expect-error
        mapSchema({ foo: '' });
      },
      {
        name: 'TypeError',
        message:
          'Expected property "foo" to be one(boolean, number) but got ""',
        code: 'E_SCHEMA'
      }
    );
  });

  it('knows that values are not undefined', () => {
    const mapSchema = schema(map(string, number));

    const test = mapSchema({ foo: 1, bar: 2 });

    assert.equals(
      // This shouldn't compain about n being possibly 'undefined'
      Object.values(test).map((n) => n + 1),
      [2, 3]
    );
  });

  it('throws on undefined values', () => {
    const mapSchema = schema(map(string, number));

    assert.exception(
      () => {
        // @ts-expect-error
        mapSchema({ foo: undefined });
      },
      {
        name: 'TypeError',
        message: 'Missing property "foo"',
        code: 'E_SCHEMA'
      }
    );
  });

  context('reader', () => {
    it('serializes to JSON', () => {
      const mapSchema = schema(map(string, integer));

      const map_reader = mapSchema.read({ test: 42 });

      assert.json(JSON.stringify(map_reader), { test: 42 });
    });

    it('uses toJSON representation of given object when initializing', () => {
      const mapSchema = schema(map(string, integer));
      const original = { is: 42 };
      const writer = mapSchema.write(original);
      const reader = mapSchema.read(writer);

      const raw = reader.toJSON();

      refute.same(raw, writer);
      assert.same(raw, original);
    });

    it('returned items are the same', () => {
      const mapSchema = schema(map(string, object({ num: integer })));
      const reader = mapSchema.read({ test: { num: 42 } });

      assert.same(reader.test, reader.test);
    });

    it('does not fail on reader for property with one(null, ...)', () => {
      const test = schema(map(string, one(literal(null), string)));

      const reader = test.read({ test: null });

      refute.exception(() => {
        return reader.test;
      });
    });
  });

  context('writer', () => {
    it('serializes to JSON', () => {
      const mapSchema = schema(map(string, integer));

      const map_writer = mapSchema.write({ test: 42 });

      assert.json(JSON.stringify(map_writer), { test: 42 });
    });

    it('uses toJSON representation of given object when initializing', () => {
      const mapSchema = schema(map(string, integer));
      const original = { is: 42 };
      const reader = mapSchema.read(original);
      const writer = mapSchema.write(reader);

      const raw = writer.toJSON();

      refute.same(raw, reader);
      assert.same(raw, original);
    });

    it('does not return cached value after set', () => {
      const mapSchema = schema(map(string, object({ num: integer })));
      const writer = mapSchema.write({ test: { num: 42 } });

      assert.equals(writer.test, { num: 42 }); // read the value
      writer.test = { num: 7 };

      assert.equals(writer.test, { num: 7 });
    });

    it('returned items are the same', () => {
      const mapSchema = schema(map(string, object({ num: integer })));
      const writer = mapSchema.write({ test: { num: 42 } });

      assert.same(writer.test, writer.test);
    });

    it('does not fail on writer for property with one(null, ...)', () => {
      const test = schema(map(string, one(literal(null), string)));

      const writer = test.write({ test: null });

      refute.exception(() => {
        return writer.test;
      });
    });

    it('does not fail on writer for property with one(integer, ...)', () => {
      const test = schema(map(string, one(integer, string)));

      const writer = test.write({ test: 1 });

      refute.exception(() => {
        return writer.test;
      });
    });

    it('does not fail on writer for property with one(string, ...)', () => {
      const test = schema(map(string, one(string, integer)));

      const writer = test.write({ test: 'test' });

      refute.exception(() => {
        return writer.test;
      });
    });
  });
});
