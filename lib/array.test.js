'use strict';

const { assert, refute } = require('@sinonjs/referee-sinon');
const { schema, array, object, one, defined, integer, string } = require('..');

describe('array', () => {
  it('requires valid spec argument', () => {
    assert.exception(
      () => {
        array('unknown');
      },
      {
        name: 'TypeError',
        message: 'Invalid spec "unknown"'
      }
    );
  });

  it('returns array validator', () => {
    const validator = array({ test: integer });

    assert.isTrue(validator([]));
    assert.isTrue(validator([{ test: 1 }]));
    assert.isTrue(validator([{ test: 1 }, { test: 2 }]));
    assert.isFalse(validator({ test: 1 }));
    assert.isFalse(validator([{ test: 1.2 }]));
    assert.isFalse(validator([{ test: 1 }, { test: 1.2 }]));
  });

  it('verifies array', () => {
    const verify = schema(array({ test: integer }));

    refute.exception(() => {
      verify([]);
    });
    assert.exception(
      () => {
        verify({});
      },
      {
        name: 'TypeError',
        message: 'Expected array but got {}',
        code: 'E_SCHEMA'
      }
    );
  });

  it('verifies array as object property', () => {
    const verify = schema({ test: array({ key: defined }) });

    refute.exception(() => {
      verify({ test: [] });
    });
    assert.exception(
      () => {
        verify({ test: 42 });
      },
      {
        name: 'TypeError',
        message: 'Expected property "test" to be array but got 42',
        code: 'E_SCHEMA'
      }
    );
  });

  it('validates array', () => {
    const validator = array({ test: integer });

    assert.isTrue(validator([]));
    assert.isFalse(validator({}));
  });

  it('validates array as object property', () => {
    const validator = object({ test: array({ key: defined }) });

    assert.isTrue(validator({ test: [] }));
    assert.isFalse(validator({ test: 42 }));
  });

  it('verifies array elements', () => {
    const verify = schema(array({ test: integer }));

    refute.exception(() => {
      verify([{ test: 1 }]);
    });
    assert.exception(
      () => {
        verify([{ test: 1.2 }]);
      },
      {
        name: 'TypeError',
        message: 'Expected property "[0].test" to be integer but got 1.2',
        code: 'E_SCHEMA'
      }
    );
  });

  it('can be used as child validator', () => {
    const children = array({ name: string });

    const verify = schema({ children });

    refute.exception(() => {
      verify({ children: [{ name: 'foo' }, { name: 'bar' }] });
    });
    assert.exception(
      () => {
        verify({ children: [{ name: 'foo' }, { name: 42 }] });
      },
      {
        name: 'TypeError',
        message: 'Expected property "children[1].name" to be string but got 42',
        code: 'E_SCHEMA'
      }
    );
  });

  it('can create array(object({}))', () => {
    refute.exception(() => {
      array(object({}));
    });
  });

  it('can create array("string")', () => {
    let arrayOfStrings;

    refute.exception(() => {
      arrayOfStrings = schema(array(string));
    });
    refute.exception(() => {
      arrayOfStrings(['foo', '', 'bar', '123']);
    });
    assert.exception(
      () => {
        arrayOfStrings(['foo', 1]);
      },
      {
        name: 'TypeError',
        message: 'Expected property "[1]" to be string but got 1',
        code: 'E_SCHEMA'
      }
    );
  });

  it('can create array(one({ foo: true }, { bar: true }))', () => {
    let arrayOfFooOrBar;

    refute.exception(() => {
      arrayOfFooOrBar = schema(array(one({ foo: defined }, { bar: defined })));
    });
    refute.exception(() => {
      arrayOfFooOrBar([{ foo: 1 }, { bar: '!' }, { foo: true }, { bar: null }]);
    });
    assert.exception(
      () => {
        arrayOfFooOrBar([{ foo: 1 }, { doo: '!' }]);
      },
      {
        name: 'TypeError',
        message:
          'Expected property "[1]" to be one({foo:defined}, {bar:defined}) ' +
          'but got {"doo":"!"}',
        code: 'E_SCHEMA'
      }
    );
  });

  it('returns validated array', () => {
    const arrayOfStrings = schema(array(string));

    const arr = arrayOfStrings(['foo', 'bar']);

    assert.equals(arr, ['foo', 'bar']);
  });

  context('reader', () => {
    it('returns original object for toJSON', () => {
      const arraySchema = schema(array({ test: integer }));
      const arr = [{ test: 42 }];

      const arr_reader = arraySchema.read(arr);

      assert.same(arr_reader.toJSON(), arr);
    });

    it('serializes to JSON', () => {
      const arraySchema = schema(array({ test: integer }));

      const arr_reader = arraySchema.read([{ test: 42 }]);

      assert.json(JSON.stringify(arr_reader), [{ test: 42 }]);
    });

    it('returns length', () => {
      const arraySchema = schema(array({ key: string }));

      const arr = arraySchema.read([{ key: 'foo' }, { key: 'bar' }]);

      assert.equals(arr.length, 2);
    });

    it('can be used with for-of loop', () => {
      const arraySchema = schema(array({ key: string }));

      const arr = arraySchema.read([{ key: 'foo' }, { key: 'bar' }]);
      const keys = [];
      for (const entry of arr) {
        keys.push(entry.key);
      }
      assert.equals(keys, ['foo', 'bar']);
    });

    it('uses toJSON representation of given object when initializing', () => {
      const arraySchema = schema(array(string));
      const original = ['a', 'b'];
      const writer = arraySchema.write(original);
      const reader = arraySchema.read(writer);

      const raw = reader.toJSON();

      refute.same(raw, writer);
      assert.same(raw, original);
    });

    it('returned items are the same', () => {
      const arraySchema = schema(array({ test: integer }));
      const arr = [{ test: 1 }];

      const reader = arraySchema.read(arr);

      assert.same(reader[0], reader[0]);
    });
  });

  context('writer', () => {
    it('returns original object for toJSON', () => {
      const arraySchema = schema(array({ test: integer }));
      const arr = [{ test: 42 }];

      const arr_reader = arraySchema.write(arr);

      assert.same(arr_reader.toJSON(), arr);
    });

    it('serializes to JSON', () => {
      const arraySchema = schema(array({ test: integer }));

      const arr_writer = arraySchema.write([{ test: 42 }]);

      assert.json(JSON.stringify(arr_writer), [{ test: 42 }]);
    });

    it('returns length', () => {
      const arraySchema = schema(array({ key: string }));

      const arr = arraySchema.write([{ key: 'foo' }, { key: 'bar' }]);

      assert.equals(arr.length, 2);
    });

    it('can be used with for-of loop', () => {
      const arraySchema = schema(array({ key: string }));

      const arr = arraySchema.write([{ key: 'foo' }, { key: 'bar' }]);
      const keys = [];
      for (const entry of arr) {
        keys.push(entry.key);
      }
      assert.equals(keys, ['foo', 'bar']);
    });

    it('uses toJSON representation of given object when initializing', () => {
      const arraySchema = schema(array(string));
      const original = ['a', 'b'];
      const reader = arraySchema.read(original);
      const writer = arraySchema.write(reader);

      const raw = writer.toJSON();

      refute.same(raw, reader);
      assert.same(raw, original);
    });

    it('does not return cached value after set', () => {
      const arraySchema = schema(array({ test: integer }));
      const arr = [{ test: 1 }];
      const writer = arraySchema.write(arr);

      assert.equals(writer[0], { test: 1 }); // read the value
      writer[0] = { test: 2 };

      assert.equals(writer[0], { test: 2 });
    });

    it('does not return cached value after splice', () => {
      const arraySchema = schema(array({ test: integer }));
      const arr = [{ test: 1 }, { test: 2 }];

      const writer = arraySchema.write(arr);
      writer.splice(0, 1);

      assert.equals(writer[0], { test: 2 });
    });

    it('returned items are the same', () => {
      const arraySchema = schema(array({ test: integer }));
      const arr = [{ test: 1 }];

      const writer = arraySchema.write(arr);

      assert.same(writer[0], writer[0]);
    });
  });
});
