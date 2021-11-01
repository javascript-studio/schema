'use strict';

const { assert, refute } = require('@sinonjs/referee-sinon');
const { schema, all, boolean, number, integer, string } = require('..');

describe('all', () => {
  it('throws if less than two arguments are given', () => {
    assert.exception(
      () => {
        all();
      },
      {
        name: 'Error',
        message: 'Require at least two arguments'
      }
    );
    assert.exception(
      () => {
        all(string);
      },
      {
        name: 'Error',
        message: 'Require at least two arguments'
      }
    );
  });

  it('fails if either of two specs fail', () => {
    const allSchema = schema(all(boolean, number));

    assert.exception(
      () => {
        allSchema(false);
      },
      {
        name: 'TypeError',
        message: 'Expected all(boolean, number) but got false',
        code: 'E_SCHEMA'
      }
    );
    assert.exception(
      () => {
        allSchema(0);
      },
      {
        name: 'TypeError',
        message: 'Expected all(boolean, number) but got 0',
        code: 'E_SCHEMA'
      }
    );
    assert.exception(
      () => {
        allSchema('test');
      },
      {
        name: 'TypeError',
        message: 'Expected all(boolean, number) but got "test"',
        code: 'E_SCHEMA'
      }
    );
  });

  it('fails as part of an object assertion', () => {
    const allSchema = schema({
      key: all(boolean, integer)
    });

    assert.exception(
      () => {
        allSchema({ key: 42 });
      },
      {
        name: 'TypeError',
        message:
          'Expected property "key" to be all(boolean, integer) but got 42',
        code: 'E_SCHEMA'
      }
    );
  });

  it('fails null and custom test', () => {
    const allSchema = schema(all(null, () => false));

    assert.exception(
      () => {
        allSchema(null);
      },
      {
        name: 'TypeError',
        message: 'Expected all(null, <custom validator>) but got null'
      }
    );
  });

  it('passes on custom tests', () => {
    const allSchema = schema(
      all(
        () => true,
        () => true
      )
    );

    refute.exception(() => {
      allSchema(null);
      allSchema('test');
      allSchema({});
    });
  });

  it('fails to access unknown property on reader', () => {
    const allSchema = schema(all({ key: string }, () => true));

    const proxy = allSchema.read({ key: 'test' });

    assert.exception(
      () => {
        return proxy.foo;
      },
      {
        name: 'ReferenceError',
        message: 'Invalid property "foo"',
        code: 'E_SCHEMA'
      }
    );
  });

  it('fails to access unknown property on writer', () => {
    const allSchema = schema(all({ key: string }, () => true));

    const proxy = allSchema.write({});

    assert.exception(
      () => {
        return proxy.foo;
      },
      {
        name: 'ReferenceError',
        message: 'Invalid property "foo"',
        code: 'E_SCHEMA'
      }
    );
  });

  it('fails to assign property on writer', () => {
    const allSchema = schema(all({ key: string }, () => true));

    const proxy = allSchema.write({});

    assert.exception(
      () => {
        proxy.key = 11;
      },
      {
        name: 'TypeError',
        message: 'Expected property "key" to be string but got 11',
        code: 'E_SCHEMA'
      }
    );
  });

  it('fails to assign property on writer (with custom validator first)', () => {
    const allSchema = schema(all(() => true, { key: string }));

    const proxy = allSchema.write({});

    assert.exception(
      () => {
        proxy.key = 11;
      },
      {
        name: 'TypeError',
        message: 'Expected property "key" to be string but got 11',
        code: 'E_SCHEMA'
      }
    );
  });
});
