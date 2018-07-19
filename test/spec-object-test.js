/*eslint-env mocha*/
'use strict';

const { assert, refute, sinon } = require('@sinonjs/referee-sinon');
const { spec } = require('..');

describe('spec object', () => {

  it('validates empty object', () => {
    const schema = spec({});

    refute.exception(() => {
      schema({});
    });
    assert.exception(() => {
      schema([]);
    }, /TypeError: Expected object but got \[\]/);
    assert.exception(() => {
      schema('test');
    }, /TypeError: Expected object but got "test"/);
    assert.exception(() => {
      schema({ some: 'thing' });
    }, /TypeError: Invalid property "some"/);
  });

  it('validates object property', () => {
    const schema = spec({ some: 'string' });

    refute.exception(() => {
      schema({ some: 'thing' });
    });
    assert.exception(() => {
      schema({});
    }, /TypeError: Expected property "some" to be string but got undefined/);
    assert.exception(() => {
      schema({ some: 'thing', other: 'thing' });
    }, /TypeError: Invalid property "other"/);
    assert.exception(() => {
      schema({ some: 123 });
    }, /TypeError: Expected property "some" to be string but got 123/);
  });

  describe('read', () => {
    const schema = spec({ some: 'string' });

    it('fails if argument is not object', () => {
      assert.exception(() => {
        schema.read([]);
      }, /TypeError: Expected object but got \[\]/);
    });

    it('validates given object', () => {
      assert.exception(() => {
        schema.read({});
      }, /TypeError: Expected property "some" to be string but got undefined/);
    });

    it('allows to get property value', () => {
      const proxy = schema.read({ some: 'thing' });

      assert.equals(proxy.some, 'thing');
    });

    it('fails reading an unknown property', () => {
      const proxy = schema.read({ some: 'thing' });

      assert.exception(() => {
        return proxy.other;
      }, /TypeError: Invalid property "other"/);
    });

    it('fails writing an unknown property', () => {
      const proxy = schema.read({ some: 'thing' });

      assert.exception(() => {
        proxy.other = 'thing';
      }, /Error: Invalid assignment on read-only object/);
    });

    it('fails writing a known property', () => {
      const proxy = schema.read({ some: 'thing' });

      assert.exception(() => {
        proxy.some = 'xyz';
      }, /Error: Invalid assignment on read-only object/);
    });

    it('fails deleting a known property', () => {
      const proxy = schema.read({ some: 'thing' });

      assert.exception(() => {
        delete proxy.some;
      }, /Error: Invalid delete on read-only object/);
      assert.isTrue(proxy.hasOwnProperty('some'));
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

  describe('write', () => {
    const schema = spec({ some: 'string' });

    it('fails if argument is not object', () => {
      assert.exception(() => {
        schema.write([]);
      }, /TypeError: Expected object but got \[\]/);
    });

    it('validates given object', () => {
      assert.exception(() => {
        schema.write({ some: 123 });
      }, /Error: Expected property "some" to be string but got 123/);
    });

    it('does not fail on missing property', () => {
      refute.exception(() => {
        schema.write({});
      });
    });

    it('allows to set property value', () => {
      const proxy = schema.write({ some: 'thing' });

      assert.equals(proxy.some, 'thing');
    });

    it('fails to set invalid property value', () => {
      const proxy = schema.write({ some: 'thing' });

      assert.exception(() => {
        proxy.some = true;
      }, /Error: Expected property "some" to be string but got true/);
    });

    it('fails reading an unknown property', () => {
      const proxy = schema.write({ some: 'thing' });

      assert.exception(() => {
        return proxy.other;
      }, /TypeError: Invalid property "other"/);
    });

    it('fails writing an unknown property', () => {
      const proxy = schema.write({ some: 'thing' });

      assert.exception(() => {
        proxy.other = 'thing';
      }, /Error: Invalid property "other"/);
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

      refute.defined(proxy.some);
      assert.isFalse(proxy.hasOwnProperty('some'));
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
      }, /TypeError: Expected property "some" to be string but got undefined/);
    });

  });

});
