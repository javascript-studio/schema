/*eslint-env mocha*/
'use strict';

const { inspect } = require('util');
const { EventEmitter } = require('events');
const { assert, refute, match, sinon } = require('@sinonjs/referee-sinon');
const { spec, object, array, map } = require('..');

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
        message: 'Invalid property "some.unknown"',
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

    it('allows to define symbol properties on proxy', () => {
      const proxy = schema.write({ some: 'thing' });
      const SYMBOL = Symbol('SYMBOL');

      refute.exception(() => {
        proxy[SYMBOL] = 'test';
      });
    });

    it('does not throw when awaiting a proxy', (done) => {
      const proxy = schema.write({ some: 'thing' });

      Promise.resolve(proxy).then(() => done()).catch(done);
    });

    it('does not throw when calling util.inspcet', () => {
      const proxy = schema.write({ some: 'thing' });

      refute.exception(() => {
        inspect(proxy);
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
        message: 'Invalid property "some.unknown"',
        code: 'SCHEMA_VALIDATION'
      });
    });

    it('fails to write an invalid property value', () => {
      const proxy = schema.write({ some: { nested: 'thing' } });

      assert.exception(() => {
        proxy.some.nested = true;
      }, {
        name: 'Error',
        message: 'Expected property "some.nested" to be string but got true',
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

  describe('write array', () => {
    const schema = spec({ array: array('number') });

    it('validates given object', () => {
      assert.exception(() => {
        schema.write({ array: [42, 'invalid'] });
      }, {
        name: 'Error',
        message: 'Expected property "array[1]" to be number but got "invalid"',
        code: 'SCHEMA_VALIDATION'
      });
    });

    it('initialized with a valid object', () => {
      const proxy = schema.write({ array: [2, 3, 7] });

      assert.equals(proxy.array, [2, 3, 7]);
    });

    it('fails to set an invalid property value', () => {
      const proxy = schema.write({ array: [42] });

      assert.exception(() => {
        proxy.array[0] = 'invalid';
      }, {
        name: 'Error',
        message: 'Expected property "array[0]" to be number but got "invalid"',
        code: 'SCHEMA_VALIDATION'
      });
    });

    it('fails to push an invalid property value', () => {
      const proxy = schema.write({ array: [42] });

      assert.exception(() => {
        proxy.array.push('invalid');
      }, {
        name: 'Error',
        message: 'Expected property "array[1]" to be number but got "invalid"',
        code: 'SCHEMA_VALIDATION'
      });
    });

    it('pushes a valid property value', () => {
      const proxy = schema.write({ array: [42] });

      proxy.array.push(7);

      assert.equals(proxy.array, [42, 7]);
    });

    it('fails to assign nun-numeric property', () => {
      const proxy = schema.write({ array: [] });

      assert.exception(() => {
        proxy.array.foo = 42;
      }, {
        name: 'Error',
        message: 'Expected property "array[foo]" to be a valid array index',
        code: 'SCHEMA_VALIDATION'
      });
    });

    it('fails to assign negative index', () => {
      const proxy = schema.write({ array: [] });

      assert.exception(() => {
        proxy.array[-1] = 42;
      }, {
        name: 'Error',
        message: 'Expected property "array[-1]" to be a valid array index',
        code: 'SCHEMA_VALIDATION'
      });
    });

    it('fails to set property in array object', () => {
      const schema = spec({ array: array({ index: 'number' }) });

      const proxy = schema.write({ array: [{ index: 0 }] });

      assert.exception(() => {
        proxy.array[0].index = 'invalid';
      }, {
        name: 'Error',
        message: 'Expected property "array.0.index" to be number '
          + 'but got "invalid"',
        code: 'SCHEMA_VALIDATION'
      });
    });
  });

  describe('write map', () => {
    const schema = spec({ map: map('string', 'number') });

    it('validates given object', () => {
      assert.exception(() => {
        schema.write({ map: { test: 'invalid' } });
      }, {
        name: 'Error',
        message: 'Expected property "map.test" to be number but got "invalid"',
        code: 'SCHEMA_VALIDATION'
      });
    });

    it('initialized with a valid object', () => {
      const proxy = schema.write({ map: { a: 1, b: 2 } });

      assert.equals(proxy.map, { a: 1, b: 2 });
    });

    it('fails to set an invalid property value', () => {
      const proxy = schema.write({ map: { a: 1 } });

      assert.exception(() => {
        proxy.map.a = 'invalid';
      }, {
        name: 'Error',
        message: 'Expected property "map.a" to be number but got "invalid"',
        code: 'SCHEMA_VALIDATION'
      });
    });

    it('fails to add an invalid property value', () => {
      const proxy = schema.write({ map: { a: 1 } });

      assert.exception(() => {
        proxy.map.b = 'invalid';
      }, {
        name: 'Error',
        message: 'Expected property "map.b" to be number but got "invalid"',
        code: 'SCHEMA_VALIDATION'
      });
    });

    it('sets a valid property value', () => {
      const proxy = schema.write({ map: { a: 1 } });

      proxy.map.a = 2;

      assert.equals(proxy.map, { a: 2 });
    });

    it('adds a valid property value', () => {
      const proxy = schema.write({ map: { a: 1 } });

      proxy.map.b = 2;

      assert.equals(proxy.map, { a: 1, b: 2 });
    });

    it('fails to set property in value object', () => {
      const schema = spec({ map: map('string', { index: 'number' }) });

      const proxy = schema.write({ map: { test: { index: 0 } } });

      assert.exception(() => {
        proxy.map.test.index = 'invalid';
      }, {
        name: 'Error',
        message: 'Expected property "map.test.index" to be number '
          + 'but got "invalid"',
        code: 'SCHEMA_VALIDATION'
      });
    });
  });

  describe('write map nested', () => {
    const nested = object({ key: 'number' });
    const schema = spec({ map: map('string', nested) });

    it('validates given object', () => {
      assert.exception(() => {
        schema.write({ map: { test: { key: 'invalid' } } });
      }, {
        name: 'Error',
        message: 'Expected property "map.test.key" to be number '
          + 'but got "invalid"',
        code: 'SCHEMA_VALIDATION'
      });
    });

    it('initialized with a valid object', () => {
      const proxy = schema.write({ map: { a: { key: 1 }, b: { key: 2 } } });

      assert.equals(proxy.map.a.key, 1);
      assert.equals(proxy.map.b.key, 2);
    });
  });

  describe('write emitter', () => {
    const schema = spec({
      some: {
        nested: 'string',
        array: array('number'),
        map: map('string', 'number')
      }
    });
    let emitter;
    let onSet;
    let onDelete;

    beforeEach(() => {
      emitter = new EventEmitter();
      onSet = sinon.fake();
      onDelete = sinon.fake();
      emitter.on('set', onSet);
      emitter.on('delete', onDelete);
    });

    it('emits "set" event for property set', () => {
      const obj = {};
      const proxy = schema.write(obj, emitter);

      proxy.some = { nested: 'test' };

      assert.calledOnceWith(onSet, {
        type: 'object',
        object: match.same(obj),
        key: 'some',
        value: { nested: 'test' },
        base: undefined,
        path: 'some'
      });
    });

    it('emits "set" event nested for property set', () => {
      const obj = {};
      const proxy = schema.write({ some: obj }, emitter);

      proxy.some.nested = 'test';

      assert.calledOnceWith(onSet, {
        type: 'object',
        object: match.same(obj),
        key: 'nested',
        value: 'test',
        base: 'some',
        path: 'some.nested'
      });
    });

    it('emits "delete" event for nested property delete', () => {
      const obj = { nested: 'test' };
      const proxy = schema.write({ some: obj }, emitter);

      delete proxy.some.nested;

      assert.calledOnceWith(onDelete, {
        type: 'object',
        object: match.same(obj),
        key: 'nested',
        base: 'some',
        path: 'some.nested'
      });
    });

    it('passes Array.isArray test for wrapped array', () => {
      const proxy = schema.write({ some: { array: [] } }, emitter);

      assert.isTrue(Array.isArray(proxy.some.array));
    });

    it('emits "set" event for nested array assign', () => {
      const array = [];
      const proxy = schema.write({ some: { array } }, emitter);

      proxy.some.array[0] = 42;

      assert.calledOnceWith(onSet, {
        type: 'array',
        array: match.same(array),
        index: 0,
        value: 42,
        base: 'some.array',
        path: 'some.array[0]'
      });
    });

    it('emits "delete" event for nested array delete', () => {
      const array = [2, 3, 7];
      const proxy = schema.write({ some: { array } }, emitter);

      delete proxy.some.array[2];

      assert.calledOnceWith(onDelete, {
        type: 'array',
        array: match.same(array),
        index: 2,
        base: 'some.array',
        path: 'some.array[2]'
      });
    });

    it('emits "push" event for nested array.push', () => {
      const onPush = sinon.fake();
      emitter.on('push', onPush);
      const array = [2, 3, 7];
      const proxy = schema.write({ some: { array } }, emitter);

      proxy.some.array.push(42);

      assert.equals(proxy.some.array, [2, 3, 7, 42]);
      assert.calledOnceWith(onPush, {
        array: match.same(array),
        base: 'some.array',
        values: [42]
      });
      refute.called(onSet);
      refute.called(onDelete);
    });

    it('validates values in array.push', () => {
      const proxy = schema.write({ some: { array: [2, 3, 7] } }, emitter);

      assert.exception(() => {
        proxy.some.array.push(42, 'invalid');
      }, {
        name: 'TypeError',
        message: 'Expected argument 2 of some.array.push to be number '
          + 'but got "invalid"'
      });
    });

    it('emits "pop" event for nested array.pop', () => {
      const onPop = sinon.fake();
      emitter.on('pop', onPop);
      const array = [2, 3, 7];
      const proxy = schema.write({ some: { array } }, emitter);

      proxy.some.array.pop();

      assert.equals(proxy.some.array, [2, 3]);
      assert.calledOnceWith(onPop, {
        array: match.same(array),
        base: 'some.array'
      });
      refute.called(onSet);
      refute.called(onDelete);
    });

    it('emits "shift" event for nested array.shift', () => {
      const onShift = sinon.fake();
      emitter.on('shift', onShift);
      const array = [2, 3, 7];
      const proxy = schema.write({ some: { array } }, emitter);

      proxy.some.array.shift();

      assert.equals(proxy.some.array, [3, 7]);
      assert.calledOnceWith(onShift, {
        array: match.same(array),
        base: 'some.array'
      });
      refute.called(onSet);
    });

    it('emits "unshift" event for nested array.unshift', () => {
      const onUnshift = sinon.fake();
      emitter.on('unshift', onUnshift);
      const array = [2, 3, 7];
      const proxy = schema.write({ some: { array } }, emitter);

      proxy.some.array.unshift(42);

      assert.equals(proxy.some.array, [42, 2, 3, 7]);
      assert.calledOnceWith(onUnshift, {
        array: match.same(array),
        base: 'some.array',
        values: [42]
      });
      refute.called(onSet);
    });

    it('validates values in array.unshift', () => {
      const proxy = schema.write({ some: { array: [2, 3, 7] } }, emitter);

      assert.exception(() => {
        proxy.some.array.unshift(42, 'invalid');
      }, {
        name: 'TypeError',
        message: 'Expected argument 2 of some.array.unshift to be number '
          + 'but got "invalid"'
      });
    });

    it('emits "splice" event for nested array.splice', () => {
      const onSplice = sinon.fake();
      emitter.on('splice', onSplice);
      const array = [2, 3, 7];
      const proxy = schema.write({ some: { array } }, emitter);

      proxy.some.array.splice(0, 2, 42, 365);

      assert.equals(proxy.some.array, [42, 365, 7]);
      assert.calledOnceWith(onSplice, {
        array: match.same(array),
        base: 'some.array',
        start: 0,
        delete_count: 2,
        values: [42, 365]
      });
      refute.called(onSet);
    });

    it('validates values in array.splice', () => {
      const proxy = schema.write({ some: { array: [2, 3, 7] } }, emitter);

      assert.exception(() => {
        proxy.some.array.splice(0, 2, 'invalid');
      }, {
        name: 'TypeError',
        message: 'Expected argument 3 of some.array.splice to be number '
          + 'but got "invalid"'
      });
    });

    it('emits "set" event for nested map property assign', () => {
      const proxy = schema.write({ some: { map: {} } }, emitter);

      proxy.some.map.key = 42;

      assert.calledOnceWith(onSet, 'some.map.key', 42);
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
