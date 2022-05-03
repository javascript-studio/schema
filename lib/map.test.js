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
  string
} = require('..');

describe('map', () => {
  it('requires both arguments to be valid specs', () => {
    assert.exception(
      () => {
        map();
      },
      {
        name: 'Error',
        message: 'Invalid spec undefined'
      }
    );
    assert.exception(
      () => {
        map(string);
      },
      {
        name: 'Error',
        message: 'Invalid spec undefined'
      }
    );
    assert.exception(
      () => {
        map(string, 'unknown');
      },
      {
        name: 'Error',
        message: 'Invalid spec "unknown"'
      }
    );
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
    const mapSchema = schema(map(/^[a-z]$/, string));

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

  it('fails for invalid objects', () => {
    const mapSchema = schema(map(string, number));

    assert.exception(
      () => {
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
    const mapSchema = schema(map(string, { index: number }));

    assert.exception(
      () => {
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
      const mapSchema = schema(map(string, { num: integer }));
      const reader = mapSchema.read({ test: { num: 42 } });

      assert.same(reader.test, reader.test);
    });

    it('does not fail on reader for property with one(null, ...)', () => {
      const test = schema(map(string, one(null, string)));

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
      const mapSchema = schema(map(string, { num: integer }));
      const writer = mapSchema.write({ test: { num: 42 } });

      assert.equals(writer.test, { num: 42 }); // read the value
      writer.test = { num: 7 };

      assert.equals(writer.test, { num: 7 });
    });

    it('returned items are the same', () => {
      const mapSchema = schema(map(string, { num: integer }));
      const writer = mapSchema.write({ test: { num: 42 } });

      assert.same(writer.test, writer.test);
    });

    it('does not fail on writer for property with one(null, ...)', () => {
      const test = schema(map(string, one(null, string)));

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
