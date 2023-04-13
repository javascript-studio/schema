'use strict';

const { assert, refute } = require('@sinonjs/referee-sinon');
const { schema, array, object, one, defined, integer, string } = require('..');

describe('array', () => {
  it('requires valid validator argument', () => {
    assert.exception(
      () => {
        // @ts-expect-error
        array('unknown');
      },
      {
        name: 'TypeError',
        message: 'Invalid validator "unknown"'
      }
    );
  });

  it('returns array validator with string items', () => {
    const validator = array(string);

    assert.isTrue(validator([]));
    assert.isTrue(validator(['']));
    assert.isTrue(validator(['one', 'two']));
    // @ts-expect-error
    assert.isFalse(validator(null));
    // @ts-expect-error
    assert.isFalse(validator([123]));
    // @ts-expect-error
    assert.isFalse(validator([{}]));
  });

  it('returns array validator with regexp items', () => {
    const validator = array(string.regexp(/^[0-9]$/));

    assert.isTrue(validator([]));
    assert.isTrue(validator(['0']));
    assert.isTrue(validator(['6', '7']));
    // @ts-expect-error
    assert.isFalse(validator(null));
    // @ts-expect-error
    assert.isFalse(validator([42]));
    assert.isFalse(validator(['42']));
  });

  it('returns array validator with object items', () => {
    const validator = array(object({ test: integer }));

    assert.isTrue(validator([]));
    assert.isTrue(validator([{ test: 1 }]));
    assert.isTrue(validator([{ test: 1 }, { test: 2 }]));
    // @ts-expect-error
    assert.isFalse(validator({ test: 1 }));
    assert.isFalse(validator([{ test: 1.2 }]));
    assert.isFalse(validator([{ test: 1 }, { test: 1.2 }]));
    // @ts-expect-error
    assert.isFalse(validator([{ test: 'test' }]));
  });

  it('verifies array', () => {
    const verify = schema(array(object({ test: integer })));

    refute.exception(() => {
      verify([]);
    });
    assert.exception(
      () => {
        // @ts-expect-error
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
    const verify = schema(object({ test: array(object({ key: defined })) }));

    refute.exception(() => {
      verify({ test: [] });
    });
    assert.exception(
      () => {
        // @ts-expect-error
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
    const validator = array(object({ test: integer }));

    assert.isTrue(validator([]));
    // @ts-expect-error
    assert.isFalse(validator({}));
  });

  it('validates array as object property', () => {
    const validator = object({ test: array(object({ key: defined })) });

    assert.isTrue(validator({ test: [] }));
    // @ts-expect-error
    assert.isFalse(validator({ test: 42 }));
  });

  it('verifies array elements', () => {
    const verify = schema(array(object({ test: integer })));

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
    const children = array(object({ name: string }));

    const verify = schema(object({ children }));

    refute.exception(() => {
      verify({ children: [{ name: 'foo' }, { name: 'bar' }] });
    });
    assert.exception(
      () => {
        // @ts-expect-error
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
      arrayOfFooOrBar = schema(
        array(one(object({ foo: defined }), object({ bar: defined })))
      );
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

  it('has type "Array"', () => {
    const validator = array(string);

    assert.equals(validator.type, 'Array');
  });

  it('exposes the items validator', () => {
    const itemTest = string.regexp(/[a-z]/);

    const validator = array(itemTest);

    assert.same(validator.items, itemTest);
    assert.same(validator.items.type, 'string');
  });

  context('reader', () => {
    it('returns original object for toJSON', () => {
      const arraySchema = schema(array(object({ test: integer })));
      const arr = [{ test: 42 }];

      const arr_reader = arraySchema.read(arr);

      assert.same(arr_reader.toJSON(), arr);
    });

    it('serializes to JSON', () => {
      const arraySchema = schema(array(object({ test: integer })));

      const arr_reader = arraySchema.read([{ test: 42 }]);

      assert.json(JSON.stringify(arr_reader), [{ test: 42 }]);
    });

    it('returns length', () => {
      const arraySchema = schema(array(object({ key: string })));

      const arr = arraySchema.read([{ key: 'foo' }, { key: 'bar' }]);

      assert.equals(arr.length, 2);
    });

    it('can be used with for-of loop', () => {
      const arraySchema = schema(array(object({ key: string })));

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
      const arraySchema = schema(array(object({ test: integer })));
      const arr = [{ test: 1 }];

      const reader = arraySchema.read(arr);

      assert.same(reader[0], reader[0]);
    });
  });

  context('writer', () => {
    it('returns original object for toJSON', () => {
      const arraySchema = schema(array(object({ test: integer })));
      const arr = [{ test: 42 }];

      const arr_reader = arraySchema.write(arr);

      assert.same(arr_reader.toJSON(), arr);
    });

    it('serializes to JSON', () => {
      const arraySchema = schema(array(object({ test: integer })));

      const arr_writer = arraySchema.write([{ test: 42 }]);

      assert.json(JSON.stringify(arr_writer), [{ test: 42 }]);
    });

    it('returns length', () => {
      const arraySchema = schema(array(object({ key: string })));

      const arr = arraySchema.write([{ key: 'foo' }, { key: 'bar' }]);

      assert.equals(arr.length, 2);
    });

    it('can be used with for-of loop', () => {
      const arraySchema = schema(array(object({ key: string })));

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
      const arraySchema = schema(array(object({ test: integer })));
      const arr = [{ test: 1 }];
      const writer = arraySchema.write(arr);

      assert.equals(writer[0], { test: 1 }); // read the value
      writer[0] = { test: 2 };

      assert.equals(writer[0], { test: 2 });
    });

    it('does not return cached value after splice', () => {
      const arraySchema = schema(array(object({ test: integer })));
      const arr = [{ test: 1 }, { test: 2 }];

      const writer = arraySchema.write(arr);
      writer.splice(0, 1);

      assert.equals(writer[0], { test: 2 });
    });

    it('returned items are the same', () => {
      const arraySchema = schema(array(object({ test: integer })));
      const arr = [{ test: 1 }];

      const writer = arraySchema.write(arr);

      assert.same(writer[0], writer[0]);
    });

    it('moved items are the same', () => {
      const arraySchema = schema(array(object({ test: integer })));
      const arr = [{ test: 1 }, { test: 2 }];

      const writer = arraySchema.write(arr);
      const second = writer[1];
      writer.splice(0, 1);

      assert.same(writer[0], second);
    });
  });
});
