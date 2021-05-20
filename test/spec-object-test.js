/*eslint-env mocha*/
'use strict';

const { assert, refute, sinon } = require('@sinonjs/referee-sinon');
const { spec, object } = require('..');

describe('spec object', () => {

  it('fails to define spec with []', () => {
    assert.exception(() => {
      spec([]);
    }, {
      name: 'TypeError',
      message: 'Invalid spec []'
    });
  });

  it('validates empty object', () => {
    const schema = spec({});

    refute.exception(() => {
      schema({});
    });
    assert.exception(() => {
      schema([]);
    }, {
      name: 'TypeError',
      message: 'Expected object but got []',
      code: 'SCHEMA_VALIDATION'
    });
    assert.exception(() => {
      schema('test');
    }, {
      name: 'TypeError',
      message: 'Expected object but got "test"',
      code: 'SCHEMA_VALIDATION'
    });
    assert.exception(() => {
      schema({ some: 'thing' });
    }, {
      name: 'ReferenceError',
      message: 'Invalid property "some"',
      code: 'SCHEMA_VALIDATION'
    });
  });

  it('validates object property', () => {
    const schema = spec({ some: 'string' });

    refute.exception(() => {
      schema({ some: 'thing' });
    });
    assert.exception(() => {
      schema({});
    }, {
      name: 'TypeError',
      message: 'Expected property "some" to be string but got undefined',
      code: 'SCHEMA_VALIDATION'
    });
    assert.exception(() => {
      schema({ some: 'thing', other: 'thing' });
    }, {
      name: 'ReferenceError',
      message: 'Invalid property "other"',
      code: 'SCHEMA_VALIDATION'
    });
    assert.exception(() => {
      schema({ some: 123 });
    }, {
      name: 'TypeError',
      message: 'Expected property "some" to be string but got 123',
      code: 'SCHEMA_VALIDATION'
    });
  });

  it('validates nested objects', () => {
    const schema = spec({ some: { nested: 'string' } });

    refute.exception(() => {
      schema({ some: { nested: 'thing' } });
    });
    assert.exception(() => {
      schema({});
    }, {
      name: 'TypeError',
      message: 'Expected property "some" to be object but got undefined',
      code: 'SCHEMA_VALIDATION'
    });
    assert.exception(() => {
      schema({ some: {} });
    }, {
      name: 'TypeError',
      message: 'Expected property "some.nested" to be string but got undefined',
      code: 'SCHEMA_VALIDATION'
    });
    assert.exception(() => {
      schema({ some: { nested: 123 } });
    }, {
      name: 'TypeError',
      message: 'Expected property "some.nested" to be string but got 123',
      code: 'SCHEMA_VALIDATION'
    });
  });

  it('returns given object', () => {
    const schema = spec({});
    const object = {};

    const returned = schema(object);

    assert.same(returned, object);
  });

  describe('read', () => {
    const schema = spec({ some: 'string' });

    it('fails if argument is not object', () => {
      assert.exception(() => {
        schema.read([]);
      }, {
        name: 'TypeError',
        message: 'Expected object but got []',
        code: 'SCHEMA_VALIDATION'
      });
    });

    it('validates given object', () => {
      assert.exception(() => {
        schema.read({});
      }, {
        name: 'TypeError',
        message: 'Expected property "some" to be string but got undefined',
        code: 'SCHEMA_VALIDATION'
      });
    });

    it('initializes with a valid object', () => {
      const proxy = schema.read({ some: 'thing' });

      assert.equals(proxy.some, 'thing');
    });

    it('fails to initialize with an unknown property', () => {
      assert.exception(() => {
        schema.read({ some: 'thing', unknown: 123 });
      }, {
        name: 'Error',
        message: 'Invalid property "unknown"',
        code: 'SCHEMA_VALIDATION'
      });
    });

    it('fails reading an unknown property', () => {
      const proxy = schema.read({ some: 'thing' });

      assert.exception(() => {
        return proxy.other;
      }, {
        name: 'ReferenceError',
        message: 'Invalid property "other"',
        code: 'SCHEMA_VALIDATION'
      });
    });

    it('fails writing an unknown property', () => {
      const proxy = schema.read({ some: 'thing' });

      assert.exception(() => {
        proxy.other = 'thing';
      }, {
        name: 'Error',
        message: 'Invalid assignment on read-only object',
        code: 'SCHEMA_VALIDATION'
      });
    });

    it('fails writing a known property', () => {
      const proxy = schema.read({ some: 'thing' });

      assert.exception(() => {
        proxy.some = 'xyz';
      }, {
        name: 'Error',
        message: 'Invalid assignment on read-only object',
        code: 'SCHEMA_VALIDATION'
      });
    });

    it('fails deleting a known property', () => {
      const proxy = schema.read({ some: 'thing' });

      assert.exception(() => {
        delete proxy.some;
      }, {
        name: 'Error',
        message: 'Invalid delete on read-only object',
        code: 'SCHEMA_VALIDATION'
      });
      assert.isTrue(Object.prototype.hasOwnProperty.call(proxy, 'some'));
    });

    it('works with JSON.stringify', () => {
      const proxy = schema.read({ some: 'thing' });

      assert.json(JSON.stringify(proxy), { some: 'thing' });
    });

    it('works with JSON.stringify and additional args', () => {
      const proxy = schema.read({ some: 'thing' });

      assert.equals(JSON.stringify(proxy, null, '  '),
        '{\n  "some": "thing"\n}');
    });

    it('does not validate again in JSON.stringify', () => {
      const fake = sinon.fake();
      const proxy = spec({ some: fake }).read({ some: true });
      fake.resetHistory();

      JSON.stringify(proxy);

      refute.called(fake);
    });

  });

  describe('read nested', () => {
    const schema = spec({ some: { nested: 'string' } });

    it('fails if argument is not object', () => {
      assert.exception(() => {
        schema.read({ some: [] });
      }, {
        name: 'TypeError',
        message: 'Expected property "some" to be object but got []',
        code: 'SCHEMA_VALIDATION'
      });
    });

    it('validates given object', () => {
      assert.exception(() => {
        schema.read({ some: {} });
      }, {
        name: 'TypeError',
        message: 'Expected property "some.nested" to be string but got '
          + 'undefined',
        code: 'SCHEMA_VALIDATION'
      });
    });

    it('initializes with a valid object', () => {
      const proxy = schema.read({ some: { nested: 'thing' } });

      assert.equals(proxy.some.nested, 'thing');
    });

    it('fails to initialize with an unknown property', () => {
      assert.exception(() => {
        schema.read({ some: { nested: 'thing', unknown: 123 } });
      }, {
        name: 'Error',
        message: 'Invalid property "unknown"',
        code: 'SCHEMA_VALIDATION'
      });
    });

    it('fails reading an unknown property', () => {
      const proxy = schema.read({ some: { nested: 'thing' } });

      assert.exception(() => {
        return proxy.some.other;
      }, {
        name: 'ReferenceError',
        message: 'Invalid property "some.other"',
        code: 'SCHEMA_VALIDATION'
      });
    });

    it('fails writing an unknown property', () => {
      const proxy = schema.read({ some: { nested: 'thing' } });

      assert.exception(() => {
        proxy.some.other = 'thing';
      }, {
        name: 'Error',
        message: 'Invalid assignment on read-only object',
        code: 'SCHEMA_VALIDATION'
      });
    });

    it('fails writing a known property', () => {
      const proxy = schema.read({ some: { nested: 'thing' } });

      assert.exception(() => {
        proxy.some.nested = 'xyz';
      }, {
        name: 'Error',
        message: 'Invalid assignment on read-only object',
        code: 'SCHEMA_VALIDATION'
      });
    });

    it('fails deleting a known property', () => {
      const proxy = schema.read({ some: { nested: 'thing' } });

      assert.exception(() => {
        delete proxy.some.nested;
      }, {
        name: 'Error',
        message: 'Invalid delete on read-only object',
        code: 'SCHEMA_VALIDATION'
      });
      assert.isTrue(Object.prototype.hasOwnProperty.call(proxy.some, 'nested'));
    });

    it('works with JSON.stringify', () => {
      const proxy = schema.read({ some: { nested: 'thing' } });

      const json = JSON.stringify(proxy);

      assert.json(json, { some: { nested: 'thing' } });
    });

    it.skip('does not validate again in JSON.stringify', () => {
      const fake = sinon.fake();
      const proxy = spec({ some: { nested: fake } })
        .read({ some: { nested: true } });
      fake.resetHistory();

      const json = JSON.stringify(proxy);

      assert.json(json, { some: { nested: true } });
      refute.called(fake);
    });

    it('always returns the same nested instance', () => {
      const proxy = schema.read({ some: { nested: 'thing' } });

      assert.same(proxy.some, proxy.some);
    });

  });

  describe('write', () => {
    const schema = spec({ some: 'string' });

    it('fails if argument is not object', () => {
      assert.exception(() => {
        schema.write([]);
      }, {
        name: 'TypeError',
        message: 'Expected object but got []',
        code: 'SCHEMA_VALIDATION'
      });
    });

    it('validates given object', () => {
      assert.exception(() => {
        schema.write({ some: 123 });
      }, {
        name: 'Error',
        message: 'Expected property "some" to be string but got 123',
        code: 'SCHEMA_VALIDATION'
      });
    });

    it('does not fail on missing property', () => {
      refute.exception(() => {
        schema.write({});
      });
    });

    it('initializes with a valid object', () => {
      const proxy = schema.write({ some: 'thing' });

      assert.equals(proxy.some, 'thing');
    });

    it('fails to initialize with an unknown property', () => {
      assert.exception(() => {
        schema.write({ unknown: 123 });
      }, {
        name: 'Error',
        message: 'Invalid property "unknown"',
        code: 'SCHEMA_VALIDATION'
      });
    });

    it('fails to write an invalid property value', () => {
      const proxy = schema.write({ some: 'thing' });

      assert.exception(() => {
        proxy.some = true;
      }, {
        name: 'Error',
        message: 'Expected property "some" to be string but got true',
        code: 'SCHEMA_VALIDATION'
      });
    });

    it('fails reading an unknown property', () => {
      const proxy = schema.write({ some: 'thing' });

      assert.exception(() => {
        return proxy.other;
      }, {
        name: 'Error',
        message: 'Invalid property "other"',
        code: 'SCHEMA_VALIDATION'
      });
    });

    it('fails writing an unknown property', () => {
      const proxy = schema.write({ some: 'thing' });

      assert.exception(() => {
        proxy.other = 'thing';
      }, {
        name: 'Error',
        message: 'Invalid property "other"',
        code: 'SCHEMA_VALIDATION'
      });
    });

    it('allows to write a known property', () => {
      const proxy = schema.write({ some: 'thing' });

      refute.exception(() => {
        proxy.some = 'xyz';
      });

      assert.equals(proxy.some, 'xyz');
    });

    it('allows to delete a known property', () => {
      const proxy = schema.write({ some: 'thing' });

      refute.exception(() => {
        delete proxy.some;
      });

      assert.isUndefined(proxy.some);
      assert.isFalse(Object.prototype.hasOwnProperty.call(proxy, 'some'));
    });

    it('works with JSON.stringify', () => {
      const proxy = schema.write({ some: 'thing' });

      assert.json(JSON.stringify(proxy), { some: 'thing' });
    });

    it('works with JSON.stringify and additional args', () => {
      const proxy = schema.write({ some: 'thing' });

      assert.equals(JSON.stringify(proxy, null, '  '),
        '{\n  "some": "thing"\n}');
    });

    it('fails in JSON.stringify if property is missing', () => {
      const proxy = schema.write({});

      assert.exception(() => {
        return JSON.stringify(proxy);
      }, {
        name: 'TypeError',
        message: 'Expected property "some" to be string but got undefined',
        code: 'SCHEMA_VALIDATION'
      });
    });

  });

  describe('write nested', () => {
    const schema = spec({ some: { nested: 'string' } });

    it('validates given object', () => {
      assert.exception(() => {
        schema.write({ some: { nested: 123 } });
      }, {
        name: 'Error',
        message: 'Expected property "some.nested" to be string but got 123',
        code: 'SCHEMA_VALIDATION'
      });
    });

    it('does not fail on missing property', () => {
      refute.exception(() => {
        schema.write({});
        schema.write({ some: {} });
      });
    });

    it('initialized with a valid object', () => {
      const proxy = schema.write({ some: { nested: 'thing' } });

      assert.equals(proxy.some.nested, 'thing');
    });

    it('fails to initialize with an unknown property', () => {
      assert.exception(() => {
        schema.write({ some: { unknown: 123 } });
      }, {
        name: 'Error',
        message: 'Invalid property "unknown"',
        code: 'SCHEMA_VALIDATION'
      });
    });

    it('fails to write an invalid property value', () => {
      const proxy = schema.write({ some: { nested: 'thing' } });

      assert.exception(() => {
        proxy.some.nested = true;
      }, {
        name: 'Error',
        message: 'Expected property "nested" to be string but got true',
        code: 'SCHEMA_VALIDATION'
      });
    });

    it('fails reading an unknown property', () => {
      const proxy = schema.write({ some: { nested: 'thing' } });

      assert.exception(() => {
        return proxy.some.other;
      }, {
        name: 'Error',
        message: 'Invalid property "some.other"',
        code: 'SCHEMA_VALIDATION'
      });
    });

    it('fails writing an unknown property', () => {
      const proxy = schema.write({ some: { nested: 'thing' } });

      assert.exception(() => {
        proxy.some.other = 'thing';
      }, {
        name: 'Error',
        message: 'Invalid property "some.other"',
        code: 'SCHEMA_VALIDATION'
      });
    });

    it('allows to write a known property', () => {
      const proxy = schema.write({ some: { nested: 'thing' } });

      refute.exception(() => {
        proxy.some.nested = 'xyz';
      });

      assert.equals(proxy.some.nested, 'xyz');
    });

    it('allows to write an incomplete property', () => {
      const proxy = schema.write({});

      refute.exception(() => {
        proxy.some = {};
      });
    });

    it('allows to delete a known property', () => {
      const proxy = schema.write({ some: { nested: 'thing' } });

      refute.exception(() => {
        delete proxy.some.nested;
      });

      assert.isUndefined(proxy.some.nested);
      assert.isFalse(Object.prototype.hasOwnProperty.call(proxy.some,
        'nested'));
    });

    it('works with JSON.stringify', () => {
      const proxy = schema.write({ some: { nested: 'thing' } });

      assert.json(JSON.stringify(proxy), { some: { nested: 'thing' } });
    });

    it('fails in JSON.stringify if property is missing', () => {
      const proxy = schema.write({ some: {} });

      assert.exception(() => {
        return JSON.stringify(proxy);
      }, {
        name: 'TypeError',
        message: 'Expected property "some.nested" to be string but got '
          + 'undefined',
        code: 'SCHEMA_VALIDATION'
      });
    });

    it('always returns the same nested instance', () => {
      const proxy = schema.write({ some: { nested: 'thing' } });

      assert.same(proxy.some, proxy.some);
    });

    it('returns undefined for missing object property without throwing', () => {
      const proxy = schema.write({});

      assert.isUndefined(proxy.some);
    });

  });

  describe('verify', () => {

    it('throws if top level property is missing', () => {
      const schema = spec({ some: { nested: 'string' } });
      const writer = schema.write({});

      assert.exception(() => {
        schema.verify(writer);
      }, {
        name: 'TypeError',
        message: 'Expected property "some" to be object but got undefined',
        code: 'SCHEMA_VALIDATION'
      });

      writer.some = {};
      assert.exception(() => {
        schema.verify(writer);
      }, {
        name: 'TypeError',
        message: 'Expected property "some.nested" to be string but got '
          + 'undefined',
        code: 'SCHEMA_VALIDATION'
      });
    });

    it('returns copy of valid object without proxy', () => {
      const schema = spec({ some: { nested: 'string' } });
      const writer = schema.write({ some: { nested: 'thing' } });

      const data = schema.verify(writer);

      assert.equals(data, { some: { nested: 'thing' } });
      refute.exception(() => {
        data.allowed = true;
      });
    });

    it('works with spec(object(...))', () => {
      const schema = spec(object({ some: { nested: 'string' } }));
      const writer = schema.write({});

      assert.exception(() => {
        schema.verify(writer);
      }, {
        name: 'TypeError',
        message: 'Expected property "some" to be object but got undefined',
        code: 'SCHEMA_VALIDATION'
      });

      writer.some = {};
      assert.exception(() => {
        schema.verify(writer);
      }, {
        name: 'TypeError',
        message: 'Expected property "some.nested" to be string but got '
          + 'undefined',
        code: 'SCHEMA_VALIDATION'
      });

      writer.some.nested = 'thing';
      const data = schema.verify(writer);

      assert.equals(data, { some: { nested: 'thing' } });
      refute.exception(() => {
        data.allowed = true;
      });
    });

    it('throws if given object is plain object', () => {
      const schema = spec(object({ some: { nested: 'string' } }));

      assert.exception(() => {
        schema.verify({});
      }, {
        name: 'TypeError',
        message: 'Not a schema reader or writer'
      });
    });

  });

  describe('raw', () => {
    const schema = spec({ some: { nested: 'string' } });

    it('returns the raw data of the given reader', () => {
      const reader = schema.read({ some: { nested: 'thing' } });

      const data = schema.raw(reader);

      assert.equals(data, { some: { nested: 'thing' } });
    });

    it('returns the raw data of the given writer', () => {
      const writer = schema.write({ some: { nested: 'thing' } });

      const data = schema.raw(writer);

      assert.equals(data, { some: { nested: 'thing' } });
    });

    it('does not fail to add properties to raw data', () => {
      const writer = schema.write({ some: { nested: 'thing' } });

      const data = schema.raw(writer);

      refute.exception(() => {
        data.foo = 1;
      });
    });

    it('does not fail if writer object is incomplete', () => {
      const writer = schema.write({ some: {} });

      let data;
      refute.exception(() => {
        data = schema.raw(writer);
      });

      assert.equals(data, { some: {} });
    });

    it('throws if given object is plain object', () => {
      assert.exception(() => {
        schema.raw({});
      }, {
        name: 'TypeError',
        message: 'Not a schema reader or writer'
      });
    });

  });

});
