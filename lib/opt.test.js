'use strict';

const { assert, refute, sinon } = require('@sinonjs/referee-sinon');
const {
  schema,
  object,
  array,
  opt,
  boolean,
  number,
  integer,
  string
} = require('..');

describe('opt', () => {
  it('has type of wrapped spec', () => {
    assert.equals(opt(boolean).type, 'boolean');
    assert.equals(opt(number).type, 'number');
    assert.equals(opt(string).type, 'string');
  });

  it('has optional = true', () => {
    assert.isTrue(opt(boolean).optional);
    assert.isTrue(opt(number).optional);
    assert.isTrue(opt(string).optional);
  });

  it('has properties of wrapped object', () => {
    const obj = object({ num: number });

    const optional = opt(obj);

    assert.equals(optional.type, 'Object');
    assert.equals(optional.properties, obj.properties);
  });

  it('has items of wrapped array', () => {
    const numbers = array(number);

    const optional = opt(numbers);

    assert.equals(optional.type, 'Array');
    assert.same(optional.items, numbers.items);
  });

  it('works with undefined or string', () => {
    const optSchema = schema(opt(string));

    refute.exception(() => {
      optSchema(undefined);
    });
    refute.exception(() => {
      optSchema('');
    });
    refute.exception(() => {
      optSchema('test');
    });
  });

  it('works with undefined or boolean', () => {
    const optSchema = schema(opt(boolean));

    refute.exception(() => {
      optSchema(undefined);
    });
    refute.exception(() => {
      optSchema(true);
    });
    refute.exception(() => {
      optSchema(false);
    });
  });

  it('works with undefined or number', () => {
    const optSchema = schema(opt(number));

    refute.exception(() => {
      optSchema(undefined);
    });
    refute.exception(() => {
      optSchema(0);
    });
    refute.exception(() => {
      optSchema(1);
    });
    refute.exception(() => {
      optSchema(42);
    });
  });

  it('works with undefined or array of objects', () => {
    const optSchema = schema(opt([{ yesno: boolean }]));

    refute.exception(() => {
      optSchema(undefined);
    });
    refute.exception(() => {
      optSchema([]);
    });
    refute.exception(() => {
      optSchema([{ yesno: true }]);
    });
    refute.exception(() => {
      optSchema([{ yesno: false }]);
    });
  });

  it('with object', () => {
    const optSchema = schema(opt({ yesno: boolean }));

    refute.exception(() => {
      optSchema({ yesno: false });
    }, {});
    assert.exception(
      () => {
        optSchema({ yesno: 42 });
      },
      {
        name: 'TypeError',
        message: 'Expected property "yesno" to be boolean but got 42',
        code: 'E_SCHEMA'
      }
    );
  });

  it('with array of strings', () => {
    const optSchema = schema(opt(array(string)));

    refute.exception(() => {
      optSchema([]);
    }, {});
    assert.exception(
      () => {
        optSchema([42]);
      },
      {
        name: 'TypeError',
        message: 'Expected property "[0]" to be string but got 42',
        code: 'E_SCHEMA'
      }
    );
  });

  it('with array of strings (with [] instead of array())', () => {
    const optSchema = schema(opt([string]));

    refute.exception(() => {
      optSchema([]);
    });
    refute.exception(() => {
      optSchema(['test']);
    });
    assert.exception(
      () => {
        optSchema([42]);
      },
      {
        name: 'TypeError',
        message: 'Expected property "[0]" to be string but got 42',
        code: 'E_SCHEMA'
      }
    );
  });

  it('does not throw if given schema is valid', () => {
    const optSchema = schema(opt(string));

    refute.exception(() => {
      optSchema('');
      optSchema('test');
    });
  });

  it('invokes custom function with value', () => {
    const fake = sinon.fake();
    const optSchema = opt(fake);

    optSchema('test');

    assert.calledOnceWith(fake, 'test');
  });

  it('fails if value is invalid', () => {
    const optSchema = schema(opt(string));

    assert.exception(
      () => {
        optSchema(123);
      },
      {
        name: 'TypeError',
        message: 'Expected string but got 123',
        code: 'E_SCHEMA'
      }
    );
    assert.exception(
      () => {
        optSchema(0);
      },
      {
        name: 'TypeError',
        message: 'Expected string but got 0',
        code: 'E_SCHEMA'
      }
    );
    assert.exception(
      () => {
        optSchema(false);
      },
      {
        name: 'TypeError',
        message: 'Expected string but got false',
        code: 'E_SCHEMA'
      }
    );
    assert.exception(
      () => {
        optSchema(true);
      },
      {
        name: 'TypeError',
        message: 'Expected string but got true',
        code: 'E_SCHEMA'
      }
    );
  });

  it('does not fail to JSON.stringify a schema with a missing optional', () => {
    const optSchema = schema({
      name: string,
      age: opt(integer)
    });

    const json = optSchema.write({ name: 'Max' });

    assert.json(JSON.stringify(json), { name: 'Max' });
  });

  it('does not fail to delete', () => {
    const optSchema = schema({
      age: opt(integer)
    });

    const json = optSchema.write({ age: 41 });

    refute.exception(() => {
      delete json.age;
    });
  });

  it('fails to assign undefined', () => {
    const optSchema = schema({
      age: opt(integer)
    });

    const json = optSchema.write({ age: 41 });

    assert.exception(
      () => {
        json.age = '';
      },
      {
        name: 'TypeError',
        message: 'Expected property "age" to be integer but got ""',
        code: 'E_SCHEMA'
      }
    );
  });

  it('fails to initialize writer with undefined', () => {
    const optSchema = schema({
      age: opt(integer)
    });

    assert.exception(
      () => {
        optSchema.write({ age: NaN });
      },
      {
        name: 'TypeError',
        message: 'Expected property "age" to be integer but got NaN',
        code: 'E_SCHEMA'
      }
    );
  });

  it('fails to initialize reader with undefined', () => {
    const optSchema = schema({
      age: opt(integer)
    });

    assert.exception(
      () => {
        optSchema.read({ age: false });
      },
      {
        name: 'TypeError',
        message: 'Expected property "age" to be integer but got false',
        code: 'E_SCHEMA'
      }
    );
  });

  it('fails validator with undefined', () => {
    const optSchema = schema({
      age: opt(integer)
    });

    assert.exception(
      () => {
        optSchema({ age: true });
      },
      {
        name: 'TypeError',
        message: 'Expected property "age" to be integer but got true',
        code: 'E_SCHEMA'
      }
    );
  });

  it('fails validator with custom function', () => {
    const optSchema = schema(opt(() => false));

    assert.exception(
      () => {
        optSchema(1);
      },
      {
        name: 'TypeError',
        message: 'Expected <custom validator> but got 1',
        code: 'E_SCHEMA'
      }
    );
  });

  it('fails with given error code', () => {
    const optSchema = schema(opt(() => false));

    assert.exception(
      () => {
        optSchema(1, { error_code: 'INVALID' });
      },
      {
        code: 'INVALID'
      }
    );
  });

  it('fails validator with nested object property', () => {
    const optSchema = schema(opt({ index: integer }));

    assert.exception(
      () => {
        optSchema({ index: 'no' });
      },
      {
        name: 'TypeError',
        message: 'Expected property "index" to be integer but got "no"',
        code: 'E_SCHEMA'
      }
    );
  });

  it('fails to access unknown property on reader', () => {
    const optSchema = schema(opt({}));

    const proxy = optSchema.read({});

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
    const optSchema = schema(opt({}));

    const proxy = optSchema.write({});

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

  it('does not add `verify` or toString to given function', () => {
    const fn = () => true;

    opt(fn);

    assert.isUndefined(Object.getOwnPropertyDescriptor(fn, 'verify'));
    assert.isUndefined(Object.getOwnPropertyDescriptor(fn, 'toString'));
  });
});
