'use strict';

const { inspect } = require('util');
const { assert, refute, sinon } = require('@sinonjs/referee-sinon');
const {
  schema,
  object,
  array,
  map,
  integer,
  number,
  string,
  opt,
  validator
} = require('..');

describe('schema object', () => {
  it('fails to define schema with []', () => {
    assert.exception(
      () => {
        // @ts-expect-error
        schema([]);
      },
      {
        name: 'TypeError',
        message: 'Invalid validator []'
      }
    );
  });

  it('validates empty object', () => {
    const objectSchema = schema(object({}));

    refute.exception(() => {
      objectSchema({});
    });
    assert.exception(
      () => {
        objectSchema([]);
      },
      {
        name: 'TypeError',
        message: 'Expected object but got []',
        code: 'E_SCHEMA'
      }
    );
    assert.exception(
      () => {
        objectSchema('test');
      },
      {
        name: 'TypeError',
        message: 'Expected object but got "test"',
        code: 'E_SCHEMA'
      }
    );
    assert.exception(
      () => {
        objectSchema({ some: 'thing' });
      },
      {
        name: 'ReferenceError',
        message: 'Invalid property "some"',
        code: 'E_SCHEMA'
      }
    );
  });

  it('validates object property with type string', () => {
    const objectSchema = schema(object({ some: string }));

    refute.exception(() => {
      objectSchema({ some: 'thing' });
    });
    assert.exception(
      () => {
        // @ts-expect-error
        objectSchema({});
      },
      {
        name: 'TypeError',
        message: 'Missing property "some"',
        code: 'E_SCHEMA'
      }
    );
    assert.exception(
      () => {
        // @ts-expect-error
        objectSchema({ some: 'thing', other: 'thing' });
      },
      {
        name: 'ReferenceError',
        message: 'Invalid property "other"',
        code: 'E_SCHEMA'
      }
    );
    assert.exception(
      () => {
        // @ts-expect-error
        objectSchema({ some: 123 });
      },
      {
        name: 'TypeError',
        message: 'Expected property "some" to be string but got 123',
        code: 'E_SCHEMA'
      }
    );
  });

  it('validates optional object property with type integer', () => {
    const test = schema(object({ age: opt(integer) }));

    refute.exception(() => test({ age: 42 }));
    // @ts-expect-error
    assert.exception(() => test({ age: '42' }), {
      name: 'TypeError',
      message: 'Expected property "age" to be integer but got "42"',
      code: 'E_SCHEMA'
    });
    // @ts-expect-error
    assert.exception(() => test({ other: true }), {
      name: 'ReferenceError',
      message: 'Invalid property "other"',
      code: 'E_SCHEMA'
    });
  });

  it('validates object property with type object.any', () => {
    const objectSchema = schema(object({ some: object.any }));

    refute.exception(() => {
      objectSchema({ some: { random: 42 } });
    });
    assert.exception(
      () => {
        // @ts-expect-error
        objectSchema({ some: 42 });
      },
      {
        name: 'TypeError',
        message: 'Expected property "some" to be object but got 42',
        code: 'E_SCHEMA'
      }
    );
  });

  it('validates object property with type array.any', () => {
    const objectSchema = schema(object({ some: array.any }));

    refute.exception(() => {
      objectSchema({ some: [{ random: 42 }] });
    });
    assert.exception(
      () => {
        // @ts-expect-error
        objectSchema({ some: 42 });
      },
      {
        name: 'TypeError',
        message: 'Expected property "some" to be array but got 42',
        code: 'E_SCHEMA'
      }
    );
  });

  it('validates nested objects', () => {
    const objectSchema = schema(object({ some: object({ nested: string }) }));

    refute.exception(() => {
      objectSchema({ some: { nested: 'thing' } });
    });
    assert.exception(
      () => {
        // @ts-expect-error
        objectSchema({});
      },
      {
        name: 'TypeError',
        message: 'Missing property "some"',
        code: 'E_SCHEMA'
      }
    );
    assert.exception(
      () => {
        // @ts-expect-error
        objectSchema({ some: {} });
      },
      {
        name: 'TypeError',
        message: 'Missing property "some.nested"',
        code: 'E_SCHEMA'
      }
    );
    assert.exception(
      () => {
        // @ts-expect-error
        objectSchema({ some: { nested: 123 } });
      },
      {
        name: 'TypeError',
        message: 'Expected property "some.nested" to be string but got 123',
        code: 'E_SCHEMA'
      }
    );
  });

  it('uses custom error_code', () => {
    const objectSchema = schema(object({ some: string }), {
      error_code: 'INVALID'
    });

    assert.exception(
      () => {
        // @ts-expect-error
        objectSchema({});
      },
      {
        name: 'TypeError',
        message: 'Missing property "some"',
        code: 'INVALID'
      }
    );
    assert.exception(
      () => {
        // @ts-expect-error
        objectSchema({ some: 42 });
      },
      {
        name: 'TypeError',
        message: 'Expected property "some" to be string but got 42',
        code: 'INVALID'
      }
    );
    assert.exception(
      () => {
        // @ts-expect-error
        objectSchema({ some: 'thing', other: 'thing' });
      },
      {
        name: 'ReferenceError',
        message: 'Invalid property "other"',
        code: 'INVALID'
      }
    );
  });

  it('uses custom error_code with object', () => {
    const objectSchema = schema(object({ some: string }), {
      error_code: 'INVALID'
    });

    assert.exception(
      () => {
        // @ts-expect-error
        objectSchema({});
      },
      {
        name: 'TypeError',
        message: 'Missing property "some"',
        code: 'INVALID'
      }
    );
    assert.exception(
      () => {
        // @ts-expect-error
        objectSchema({ some: 42 });
      },
      {
        name: 'TypeError',
        message: 'Expected property "some" to be string but got 42',
        code: 'INVALID'
      }
    );
    assert.exception(
      () => {
        // @ts-expect-error
        objectSchema({ some: 'thing', other: 'thing' });
      },
      {
        name: 'ReferenceError',
        message: 'Invalid property "other"',
        code: 'INVALID'
      }
    );
  });

  it('returns given object', () => {
    const objectSchema = schema(object({ test: number }));
    const obj = { test: 42 };

    const returned = objectSchema(obj);

    assert.same(returned, obj);
  });

  describe('read', () => {
    const objectSchema = schema(object({ some: string }));

    it('fails if argument is not object', () => {
      assert.exception(
        () => {
          // @ts-expect-error
          objectSchema.read([]);
        },
        {
          name: 'TypeError',
          message: 'Expected object but got []',
          code: 'E_SCHEMA'
        }
      );
    });

    it('validates given object', () => {
      assert.exception(
        () => {
          // @ts-expect-error
          objectSchema.read({});
        },
        {
          name: 'TypeError',
          message: 'Missing property "some"',
          code: 'E_SCHEMA'
        }
      );
    });

    it('initializes with a valid object', () => {
      const proxy = objectSchema.read({ some: 'thing' });

      assert.equals(proxy.some, 'thing');
    });

    it('fails to initialize with an unknown property', () => {
      assert.exception(
        () => {
          // @ts-expect-error
          objectSchema.read({ some: 'thing', unknown: 123 });
        },
        {
          name: 'Error',
          message: 'Invalid property "unknown"',
          code: 'E_SCHEMA'
        }
      );
    });

    it('fails reading an unknown property', () => {
      const proxy = objectSchema.read({ some: 'thing' });

      assert.exception(
        () => {
          // @ts-expect-error
          return proxy.other;
        },
        {
          name: 'ReferenceError',
          message: 'Invalid property "other"',
          code: 'E_SCHEMA'
        }
      );
    });

    it('fails writing an unknown property', () => {
      const proxy = objectSchema.read({ some: 'thing' });

      assert.exception(
        () => {
          // @ts-expect-error
          proxy.other = 'thing';
        },
        {
          name: 'Error',
          message: 'Invalid assignment on read-only object',
          code: 'E_SCHEMA'
        }
      );
    });

    it('fails writing a known property', () => {
      const proxy = objectSchema.read({ some: 'thing' });

      assert.exception(
        () => {
          proxy.some = 'xyz';
        },
        {
          name: 'Error',
          message: 'Invalid assignment on read-only object',
          code: 'E_SCHEMA'
        }
      );
    });

    it('fails deleting a known property', () => {
      const proxy = objectSchema.read({ some: 'thing' });

      assert.exception(
        () => {
          // @ts-expect-error
          delete proxy.some;
        },
        {
          name: 'Error',
          message: 'Invalid delete on read-only object',
          code: 'E_SCHEMA'
        }
      );
      assert.isTrue(Object.prototype.hasOwnProperty.call(proxy, 'some'));
    });

    it('returns original object for toJSON', () => {
      const original = { some: 'thing' };
      const proxy = objectSchema.read(original);

      assert.same(proxy.toJSON(), original);
    });

    it('works with JSON.stringify', () => {
      const proxy = objectSchema.read({ some: 'thing' });

      assert.json(JSON.stringify(proxy), { some: 'thing' });
    });

    it('works with JSON.stringify and additional args', () => {
      const proxy = objectSchema.read({ some: 'thing' });

      assert.equals(
        JSON.stringify(proxy, null, '  '),
        '{\n  "some": "thing"\n}'
      );
    });

    it('does not validate again in JSON.stringify', () => {
      const fake = sinon.fake();
      const proxy = schema(object({ some: validator(fake) })).read({
        some: true
      });
      fake.resetHistory();

      JSON.stringify(proxy);

      refute.called(fake);
    });

    it('uses toJSON representation of given object when initializing', () => {
      const original = { some: 'thing' };
      const writer = objectSchema.write(original);
      const reader = objectSchema.read(writer);

      const raw = reader.toJSON();

      refute.same(raw, writer);
      assert.same(raw, original);
    });

    it('uses custom error_code', () => {
      const customCodeSchema = schema(object({ some: string }), {
        error_code: 'INVALID'
      });

      assert.exception(
        () => {
          // @ts-expect-error
          customCodeSchema.read({});
        },
        {
          name: 'TypeError',
          message: 'Missing property "some"',
          code: 'INVALID'
        }
      );
      assert.exception(
        () => {
          // @ts-expect-error
          customCodeSchema.read({ some: 42 });
        },
        {
          name: 'TypeError',
          message: 'Expected property "some" to be string but got 42',
          code: 'INVALID'
        }
      );
      assert.exception(
        () => {
          // @ts-expect-error
          customCodeSchema.read({ some: 'thing', other: 'thing' });
        },
        {
          name: 'ReferenceError',
          message: 'Invalid property "other"',
          code: 'INVALID'
        }
      );
    });

    it('uses custom error_code with object', () => {
      const customCodeSchema = schema(object({ some: string }), {
        error_code: 'INVALID'
      });

      assert.exception(
        () => {
          // @ts-expect-error
          customCodeSchema.read({});
        },
        {
          name: 'TypeError',
          message: 'Missing property "some"',
          code: 'INVALID'
        }
      );
      assert.exception(
        () => {
          // @ts-expect-error
          customCodeSchema.read({ some: 42 });
        },
        {
          name: 'TypeError',
          message: 'Expected property "some" to be string but got 42',
          code: 'INVALID'
        }
      );
      assert.exception(
        () => {
          // @ts-expect-error
          customCodeSchema.read({ some: 'thing', other: 'thing' });
        },
        {
          name: 'ReferenceError',
          message: 'Invalid property "other"',
          code: 'INVALID'
        }
      );
    });
  });

  describe('read nested', () => {
    const objectSchema = schema(object({ some: object({ nested: string }) }));

    it('fails if argument is not object', () => {
      assert.exception(
        () => {
          // @ts-expect-error
          objectSchema.read({ some: [] });
        },
        {
          name: 'TypeError',
          message: 'Expected property "some" to be object but got []',
          code: 'E_SCHEMA'
        }
      );
    });

    it('validates given object', () => {
      assert.exception(
        () => {
          // @ts-expect-error
          objectSchema.read({ some: {} });
        },
        {
          name: 'TypeError',
          message: 'Missing property "some.nested"',
          code: 'E_SCHEMA'
        }
      );
    });

    it('initializes with a valid object', () => {
      const proxy = objectSchema.read({ some: { nested: 'thing' } });

      assert.equals(proxy.some.nested, 'thing');
    });

    it('fails to initialize with an unknown property', () => {
      assert.exception(
        () => {
          // @ts-expect-error
          objectSchema.read({ some: { nested: 'thing', unknown: 123 } });
        },
        {
          name: 'Error',
          message: 'Invalid property "some.unknown"',
          code: 'E_SCHEMA'
        }
      );
    });

    it('fails reading an unknown property', () => {
      const proxy = objectSchema.read({ some: { nested: 'thing' } });

      assert.exception(
        () => {
          // @ts-expect-error
          return proxy.some.other;
        },
        {
          name: 'ReferenceError',
          message: 'Invalid property "some.other"',
          code: 'E_SCHEMA'
        }
      );
    });

    it('fails writing an unknown property', () => {
      const proxy = objectSchema.read({ some: { nested: 'thing' } });

      assert.exception(
        () => {
          // @ts-expect-error
          proxy.some.other = 'thing';
        },
        {
          name: 'Error',
          message: 'Invalid assignment on read-only object',
          code: 'E_SCHEMA'
        }
      );
    });

    it('fails writing a known property', () => {
      const proxy = objectSchema.read({ some: { nested: 'thing' } });

      assert.exception(
        () => {
          proxy.some.nested = 'xyz';
        },
        {
          name: 'Error',
          message: 'Invalid assignment on read-only object',
          code: 'E_SCHEMA'
        }
      );
    });

    it('fails deleting a known property', () => {
      const proxy = objectSchema.read({ some: { nested: 'thing' } });

      assert.exception(
        () => {
          // @ts-expect-error
          delete proxy.some.nested;
        },
        {
          name: 'Error',
          message: 'Invalid delete on read-only object',
          code: 'E_SCHEMA'
        }
      );
      assert.isTrue(Object.prototype.hasOwnProperty.call(proxy.some, 'nested'));
    });

    it('returns original object for toJSON', () => {
      const original = { some: { nested: 'thing' } };
      const proxy = objectSchema.read(original);

      assert.same(proxy.toJSON(), original);
    });

    it('works with JSON.stringify', () => {
      const proxy = objectSchema.read({ some: { nested: 'thing' } });

      const json = JSON.stringify(proxy);

      assert.json(json, { some: { nested: 'thing' } });
    });

    it('does not validate again in JSON.stringify', () => {
      const fake = sinon.fake();
      const proxy = schema(
        object({ some: object({ nested: validator(fake) }) })
      ).read({
        some: { nested: true }
      });
      fake.resetHistory();

      const json = JSON.stringify(proxy);

      assert.json(json, { some: { nested: true } });
      refute.called(fake);
    });

    it('always returns the same nested instance', () => {
      const proxy = objectSchema.read({ some: { nested: 'thing' } });

      assert.same(proxy.some, proxy.some);
    });
  });

  describe('write', () => {
    const objectSchema = schema(object({ some: string }));

    it('fails if argument is not object', () => {
      assert.exception(
        () => {
          // @ts-expect-error
          objectSchema.write([]);
        },
        {
          name: 'TypeError',
          message: 'Expected object but got []',
          code: 'E_SCHEMA'
        }
      );
    });

    it('validates given object', () => {
      assert.exception(
        () => {
          // @ts-expect-error
          objectSchema.write({ some: 123 });
        },
        {
          name: 'Error',
          message: 'Expected property "some" to be string but got 123',
          code: 'E_SCHEMA'
        }
      );
    });

    it('initializes with a valid object', () => {
      const proxy = objectSchema.write({ some: 'thing' });

      assert.equals(proxy.some, 'thing');
    });

    it('fails to initialize with an unknown property', () => {
      assert.exception(
        () => {
          // @ts-expect-error
          objectSchema.write({ some: 'test', unknown: 123 });
        },
        {
          name: 'Error',
          message: 'Invalid property "unknown"',
          code: 'E_SCHEMA'
        }
      );
    });

    it('fails to write an invalid property value', () => {
      const proxy = objectSchema.write({ some: 'thing' });

      assert.exception(
        () => {
          // @ts-expect-error
          proxy.some = true;
        },
        {
          name: 'Error',
          message: 'Expected property "some" to be string but got true',
          code: 'E_SCHEMA'
        }
      );
    });

    it('fails reading an unknown property', () => {
      const proxy = objectSchema.write({ some: 'thing' });

      assert.exception(
        () => {
          // @ts-expect-error
          return proxy.other;
        },
        {
          name: 'Error',
          message: 'Invalid property "other"',
          code: 'E_SCHEMA'
        }
      );
    });

    it('fails writing an unknown property', () => {
      const proxy = objectSchema.write({ some: 'thing' });

      assert.exception(
        () => {
          // @ts-expect-error
          proxy.other = 'thing';
        },
        {
          name: 'Error',
          message: 'Invalid property "other"',
          code: 'E_SCHEMA'
        }
      );
    });

    it('allows to write a known property', () => {
      const proxy = objectSchema.write({ some: 'thing' });

      refute.exception(() => {
        proxy.some = 'xyz';
      });

      assert.equals(proxy.some, 'xyz');
    });

    it('fails to delete a required property', () => {
      const proxy = objectSchema.write({ some: 'thing' });

      assert.exception(
        () => {
          // @ts-expect-error
          delete proxy.some;
        },
        {
          name: 'TypeError',
          message: 'Invalid delete on non-optional property "some"',
          code: 'E_SCHEMA'
        }
      );

      assert.equals(proxy.some, 'thing');
    });

    it('allows to delete an optional property', () => {
      const testSchema = schema(object({ some: opt(string) }));
      const proxy = testSchema.write({ some: 'thing' });

      refute.exception(() => {
        delete proxy.some;
      });

      assert.isUndefined(proxy.some);
      assert.isFalse(Object.prototype.hasOwnProperty.call(proxy, 'some'));
    });

    it('returns original object for toJSON', () => {
      const original = { some: 'thing' };
      const proxy = objectSchema.write(original);

      assert.same(proxy.toJSON(), original);
    });

    it('works with JSON.stringify', () => {
      const proxy = objectSchema.write({ some: 'thing' });

      assert.json(JSON.stringify(proxy), { some: 'thing' });
    });

    it('works with JSON.stringify and additional args', () => {
      const proxy = objectSchema.write({ some: 'thing' });

      assert.equals(
        JSON.stringify(proxy, null, '  '),
        '{\n  "some": "thing"\n}'
      );
    });

    it('does not throw in JSON.stringify if property is missing', () => {
      const proxy = objectSchema.write({});

      refute.exception(() => {
        return JSON.stringify(proxy);
      });
    });

    it('allows to define symbol properties on proxy', () => {
      const proxy = objectSchema.write({ some: 'thing' });
      const SYMBOL = Symbol('SYMBOL');

      refute.exception(() => {
        proxy[SYMBOL] = 'test';
      });
    });

    it('does not throw when awaiting a proxy', (done) => {
      const proxy = objectSchema.write({ some: 'thing' });

      Promise.resolve(proxy)
        .then(() => done())
        .catch(done);
    });

    it('does not throw when calling util.inspect', () => {
      const proxy = objectSchema.write({ some: 'thing' });

      refute.exception(() => {
        inspect(proxy);
      });
    });

    it('does not throw when accessing nodeType (sinon compatibility)', () => {
      const proxy = objectSchema.write({ some: 'thing' });

      refute.exception(() => {
        // @sinonjs/samsam accesses the nodeType property to check if an object
        // is an HTML element.
        // @ts-expect-error
        return proxy.nodeType;
      });
    });

    it('uses toJSON representation of given object when initializing', () => {
      const original = { some: 'thing' };
      const reader = objectSchema.read(original);
      const writer = objectSchema.write(reader);

      const raw = writer.toJSON();

      refute.same(raw, reader);
      assert.same(raw, original);
    });
  });

  describe('write nested', () => {
    const objectSchema = schema(
      object({
        some: object({ nested: string, optional: opt(string) })
      })
    );

    it('validates given object', () => {
      assert.exception(
        () => {
          objectSchema.write({
            some: {
              // @ts-expect-error
              nested: 123
            }
          });
        },
        {
          name: 'Error',
          message: 'Expected property "some.nested" to be string but got 123',
          code: 'E_SCHEMA'
        }
      );
    });

    it('does not fail on missing property', () => {
      refute.exception(() => {
        objectSchema.write({});
      });
    });

    it('initialized with a valid object', () => {
      const proxy = objectSchema.write({ some: { nested: 'thing' } });

      assert.equals(proxy.some.nested, 'thing');
    });

    it('fails to initialize with an unknown property', () => {
      assert.exception(
        () => {
          objectSchema.write({
            some: {
              nested: 'test',
              // @ts-expect-error
              unknown: 123
            }
          });
        },
        {
          name: 'Error',
          message: 'Invalid property "some.unknown"',
          code: 'E_SCHEMA'
        }
      );
    });

    it('fails to write an invalid property value', () => {
      const proxy = objectSchema.write({ some: { nested: 'thing' } });

      assert.exception(
        () => {
          // @ts-expect-error
          proxy.some.nested = true;
        },
        {
          name: 'Error',
          message: 'Expected property "some.nested" to be string but got true',
          code: 'E_SCHEMA'
        }
      );
    });

    it('fails reading an unknown property', () => {
      const proxy = objectSchema.write({ some: { nested: 'thing' } });

      assert.exception(
        () => {
          // @ts-expect-error
          return proxy.some.other;
        },
        {
          name: 'Error',
          message: 'Invalid property "some.other"',
          code: 'E_SCHEMA'
        }
      );
    });

    it('fails writing an unknown property', () => {
      const proxy = objectSchema.write({ some: { nested: 'thing' } });

      assert.exception(
        () => {
          // @ts-expect-error
          proxy.some.other = 'thing';
        },
        {
          name: 'Error',
          message: 'Invalid property "some.other"',
          code: 'E_SCHEMA'
        }
      );
    });

    it('allows to write a known property', () => {
      const proxy = objectSchema.write({ some: { nested: 'thing' } });

      refute.exception(() => {
        proxy.some.nested = 'xyz';
      });

      assert.equals(proxy.some.nested, 'xyz');
    });

    it('does not allow to write an incomplete property', () => {
      const proxy = objectSchema.write({});

      assert.exception(
        () => {
          // @ts-expect-error
          proxy.some = {};
        },
        {
          name: 'TypeError',
          message: 'Missing property "some.nested"',
          code: 'E_SCHEMA'
        }
      );
    });

    it('fails to delete a nested property', () => {
      const proxy = objectSchema.write({ some: { nested: 'thing' } });

      assert.exception(
        () => {
          // @ts-expect-error
          delete proxy.some.nested;
        },
        {
          name: 'TypeError',
          message: 'Invalid delete on non-optional property "some.nested"',
          code: 'E_SCHEMA'
        }
      );

      assert.equals(proxy.some.nested, 'thing');
    });

    it('allows to delete a nested optional property', () => {
      const proxy = objectSchema.write({
        some: { nested: 'thing', optional: 'test' }
      });

      refute.exception(() => {
        delete proxy.some.optional;
      });

      assert.isUndefined(proxy.some.optional);
      assert.isFalse(
        Object.prototype.hasOwnProperty.call(proxy.some, 'optional')
      );
    });

    it('returns original object for toJSON', () => {
      const original = { some: { nested: 'thing' } };
      const proxy = objectSchema.write(original);

      assert.same(proxy.toJSON(), original);
    });

    it('works with JSON.stringify', () => {
      const proxy = objectSchema.write({ some: { nested: 'thing' } });

      assert.json(JSON.stringify(proxy), { some: { nested: 'thing' } });
    });

    it('does not throw in JSON.stringify if property is missing', () => {
      const proxy = objectSchema.write({});

      refute.exception(() => {
        return JSON.stringify(proxy);
      });
    });

    it('always returns the same nested instance', () => {
      const proxy = objectSchema.write({ some: { nested: 'thing' } });

      assert.same(proxy.some, proxy.some);
    });

    it('returns undefined for missing object property without throwing', () => {
      const proxy = objectSchema.write({});

      assert.isUndefined(proxy.some);
    });

    it('uses toJSON representation of nested object when initializing', () => {
      const original = { some: { nested: 'thing' } };
      const reader = objectSchema.read(original);
      const writer = objectSchema.write({ some: reader.some });

      const raw = writer.toJSON();

      assert.same(raw.some, original.some);
    });
  });

  describe('write array', () => {
    const objectSchema = schema(object({ array: array(number) }));

    it('validates given object', () => {
      assert.exception(
        () => {
          // @ts-expect-error
          objectSchema.write({ array: [42, 'invalid'] });
        },
        {
          name: 'Error',
          message:
            'Expected property "array[1]" to be number but got "invalid"',
          code: 'E_SCHEMA'
        }
      );
    });

    it('initialized with a valid object', () => {
      const proxy = objectSchema.write({ array: [2, 3, 7] });

      assert.equals(proxy.array, [2, 3, 7]);
    });

    it('fails to set an invalid property value', () => {
      const proxy = objectSchema.write({ array: [42] });

      assert.exception(
        () => {
          // @ts-expect-error
          proxy.array[0] = 'invalid';
        },
        {
          name: 'Error',
          message:
            'Expected property "array[0]" to be number but got "invalid"',
          code: 'E_SCHEMA'
        }
      );
    });

    it('fails to push an invalid property value', () => {
      const proxy = objectSchema.write({ array: [42] });

      assert.exception(
        () => {
          // @ts-expect-error
          proxy.array.push('invalid');
        },
        {
          name: 'Error',
          message:
            'Expected property "array[1]" to be number but got "invalid"',
          code: 'E_SCHEMA'
        }
      );
    });

    it('pushes a valid property value', () => {
      const proxy = objectSchema.write({ array: [42] });

      proxy.array.push(7);

      assert.equals(proxy.array, [42, 7]);
    });

    it('fails to assign nun-numeric property', () => {
      const proxy = objectSchema.write({ array: [] });

      assert.exception(
        () => {
          // @ts-expect-error
          proxy.array.foo = 42;
        },
        {
          name: 'Error',
          message: 'Expected property "array[foo]" to be a valid array index',
          code: 'E_SCHEMA'
        }
      );
    });

    it('fails to assign negative index', () => {
      const proxy = objectSchema.write({ array: [] });

      assert.exception(
        () => {
          proxy.array[-1] = 42;
        },
        {
          name: 'Error',
          message: 'Expected property "array[-1]" to be a valid array index',
          code: 'E_SCHEMA'
        }
      );
    });

    it('fails to set property in array object', () => {
      const localObjectSchema = schema(
        object({ array: array(object({ index: number })) })
      );

      const proxy = localObjectSchema.write({ array: [{ index: 0 }] });

      assert.exception(
        () => {
          // @ts-expect-error
          proxy.array[0].index = 'invalid';
        },
        {
          name: 'Error',
          message:
            'Expected property "array[0].index" to be number ' +
            'but got "invalid"',
          code: 'E_SCHEMA'
        }
      );
    });

    it('uses toJSON representation of given object on assignment', () => {
      const localObjectSchema = schema(array(object({ index: number })));
      const original = [{ index: 1 }];
      const reader = localObjectSchema.read(original);
      const writer = localObjectSchema.write([{ index: 2 }]);

      writer[0] = reader[0];

      assert.same(writer.toJSON()[0], original[0]);
    });
  });

  describe('write map', () => {
    const objectSchema = schema(object({ map: map(string, number) }));

    it('validates given object', () => {
      assert.exception(
        () => {
          // @ts-expect-error
          objectSchema.write({ map: { test: 'invalid' } });
        },
        {
          name: 'Error',
          message:
            'Expected property "map.test" to be number but got "invalid"',
          code: 'E_SCHEMA'
        }
      );
    });

    it('initialized with a valid object', () => {
      const proxy = objectSchema.write({ map: { a: 1, b: 2 } });

      assert.equals(proxy.map, { a: 1, b: 2 });
    });

    it('fails to set an invalid property value', () => {
      const proxy = objectSchema.write({ map: { a: 1 } });

      assert.exception(
        () => {
          // @ts-expect-error
          proxy.map.a = 'invalid';
        },
        {
          name: 'Error',
          message: 'Expected property "map.a" to be number but got "invalid"',
          code: 'E_SCHEMA'
        }
      );
    });

    it('fails to add an invalid property value', () => {
      const proxy = objectSchema.write({ map: { a: 1 } });

      assert.exception(
        () => {
          // @ts-expect-error
          proxy.map.b = 'invalid';
        },
        {
          name: 'Error',
          message: 'Expected property "map.b" to be number but got "invalid"',
          code: 'E_SCHEMA'
        }
      );
    });

    it('sets a valid property value', () => {
      const proxy = objectSchema.write({ map: { a: 1 } });

      proxy.map.a = 2;

      assert.equals(proxy.map, { a: 2 });
    });

    it('adds a valid property value', () => {
      const proxy = objectSchema.write({ map: { a: 1 } });

      proxy.map.b = 2;

      assert.equals(proxy.map, { a: 1, b: 2 });
    });

    it('fails to set property in value object', () => {
      const localObjectSchema = schema(
        object({
          map: map(string, object({ index: number }))
        })
      );

      const proxy = localObjectSchema.write({ map: { test: { index: 0 } } });

      assert.exception(
        () => {
          // @ts-expect-error
          proxy.map.test.index = 'invalid';
        },
        {
          name: 'Error',
          message:
            'Expected property "map.test.index" to be number but got "invalid"',
          code: 'E_SCHEMA'
        }
      );
    });

    it('returns original object for toJSON', () => {
      const original = { map: { a: 1 } };
      const proxy = objectSchema.write(original);

      assert.same(proxy.toJSON(), original);
    });

    it('uses toJSON representation of given object on assignment', () => {
      const localObjectSchema = schema(
        object({
          map: map(string, object({ index: number }))
        })
      );
      const original = { map: { a: { index: 1 } } };
      const reader = localObjectSchema.read(original);
      const writer = localObjectSchema.write({ map: { a: { index: 2 } } });

      writer.map.a = reader.map.a;

      assert.same(writer.toJSON().map.a, original.map.a);
    });
  });

  describe('write map nested', () => {
    const nested = object({ key: number });
    const objectSchema = schema(object({ map: map(string, nested) }));

    it('validates given object', () => {
      assert.exception(
        () => {
          // @ts-expect-error
          objectSchema.write({ map: { test: { key: 'invalid' } } });
        },
        {
          name: 'Error',
          message:
            'Expected property "map.test.key" to be number but got "invalid"',
          code: 'E_SCHEMA'
        }
      );
    });

    it('initialized with a valid object', () => {
      const proxy = objectSchema.write({
        map: { a: { key: 1 }, b: { key: 2 } }
      });

      assert.equals(proxy.map.a && proxy.map.a.key, 1);
      assert.equals(proxy.map.b && proxy.map.b.key, 2);
    });
  });

  describe('verify', () => {
    it('throws if top level property is missing', () => {
      const objectSchema = schema(object({ some: object({ nested: string }) }));
      const writer = objectSchema.write({});

      assert.exception(
        () => {
          objectSchema.verify(writer);
        },
        {
          name: 'TypeError',
          message: 'Missing property "some"',
          code: 'E_SCHEMA'
        }
      );

      assert.exception(
        () => {
          // @ts-expect-error
          writer.some = {};
        },
        {
          name: 'TypeError',
          message: 'Missing property "some.nested"',
          code: 'E_SCHEMA'
        }
      );
    });

    it('returns copy of valid object without proxy', () => {
      const objectSchema = schema(object({ some: object({ nested: string }) }));
      const original = { some: { nested: 'thing' } };
      const writer = objectSchema.write(original);

      const data = objectSchema.verify(writer);

      assert.same(data, original);
      refute.exception(() => {
        // @ts-expect-error
        data.allowed = true;
      });
    });

    it('works with schema(object(...))', () => {
      const objectSchema = schema(object({ some: object({ nested: string }) }));
      const writer = objectSchema.write({});

      assert.exception(
        () => {
          objectSchema.verify(writer);
        },
        {
          name: 'TypeError',
          message: 'Missing property "some"',
          code: 'E_SCHEMA'
        }
      );

      assert.exception(
        () => {
          // @ts-expect-error
          writer.some = {};
        },
        {
          name: 'TypeError',
          message: 'Missing property "some.nested"',
          code: 'E_SCHEMA'
        }
      );

      writer.some = { nested: 'thing' };
      const data = objectSchema.verify(writer);

      assert.equals(data, { some: { nested: 'thing' } });
      refute.exception(() => {
        // @ts-expect-error
        data.allowed = true;
      });
    });

    it('throws if given object is plain object', () => {
      const objectSchema = schema(object({ some: object({ nested: string }) }));

      assert.exception(
        () => {
          // @ts-expect-error
          objectSchema.verify({});
        },
        {
          name: 'TypeError',
          message: 'Not a schema reader or writer'
        }
      );
    });

    it('throws with custom error_code', () => {
      const objectSchema = schema(object({ some: string }), {
        error_code: 'INVALID'
      });
      const writer = objectSchema.write({});

      assert.exception(
        () => {
          objectSchema.verify(writer);
        },
        {
          name: 'TypeError',
          message: 'Missing property "some"',
          code: 'INVALID'
        }
      );
    });

    it('throws with object and custom error_code', () => {
      const objectSchema = schema(object({ some: string }), {
        error_code: 'INVALID'
      });
      const writer = objectSchema.write({});

      assert.exception(
        () => {
          objectSchema.verify(writer);
        },
        {
          name: 'TypeError',
          message: 'Missing property "some"',
          code: 'INVALID'
        }
      );
    });
  });
});
