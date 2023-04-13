'use strict';

const { assert, refute, sinon } = require('@sinonjs/referee-sinon');
const {
  schema,
  object,
  array,
  map,
  opt,
  boolean,
  number,
  integer,
  string,
  validator
} = require('..');

describe('opt', () => {
  it('requires valid validator argument', () => {
    assert.exception(
      () => {
        // @ts-expect-error
        opt('unknown');
      },
      {
        name: 'TypeError',
        message: 'Invalid validator "unknown"'
      }
    );
  });

  it('has type of wrapped validator', () => {
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

  it('has properties of wrapped map', () => {
    const obj = map(string, number);

    const optional = opt(obj);

    assert.equals(optional.type, 'Map');
    assert.equals(optional.keys, obj.keys);
    assert.equals(optional.values, obj.values);
  });

  it('validates undefined or string', () => {
    const optString = opt(string);

    assert.isTrue(optString(undefined));
    assert.isTrue(optString(''));
    assert.isTrue(optString('test'));
    // @ts-expect-error
    assert.isFalse(optString(null));
    // @ts-expect-error
    assert.isFalse(optString(true));
    // @ts-expect-error
    assert.isFalse(optString(123));
  });

  it('works with undefined or boolean', () => {
    const optBoolean = opt(boolean);

    assert.isTrue(optBoolean(undefined));
    assert.isTrue(optBoolean(true));
    assert.isTrue(optBoolean(false));
    // @ts-expect-error
    assert.isFalse(optBoolean(null));
    // @ts-expect-error
    assert.isFalse(optBoolean(123));
    // @ts-expect-error
    assert.isFalse(optBoolean('test'));
  });

  it('works with undefined or number', () => {
    const optNumber = opt(number);

    assert.isTrue(optNumber(undefined));
    assert.isTrue(optNumber(0));
    assert.isTrue(optNumber(1));
    assert.isTrue(optNumber(42));
    // @ts-expect-error
    assert.isFalse(optNumber(null));
    // @ts-expect-error
    assert.isFalse(optNumber(true));
    // @ts-expect-error
    assert.isFalse(optNumber('test'));
  });

  it('works with undefined or array of objects', () => {
    const optArrayOfObjects = opt(array(object({ yesno: boolean })));

    assert.isTrue(optArrayOfObjects(undefined));
    assert.isTrue(optArrayOfObjects([]));
    assert.isTrue(optArrayOfObjects([{ yesno: true }]));
    assert.isTrue(optArrayOfObjects([{ yesno: false }]));
    // @ts-expect-error
    assert.isFalse(optArrayOfObjects({ yesno: true }));
    // @ts-expect-error
    assert.isFalse(optArrayOfObjects(['no']));
    // @ts-expect-error
    assert.isFalse(optArrayOfObjects([{ yesno: 'no' }]));
  });

  it('with object', () => {
    const optSchema = schema(opt(object({ yesno: boolean })));

    refute.exception(() => {
      optSchema({ yesno: false });
    }, {});
    assert.exception(
      () => {
        // @ts-expect-error
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
        // @ts-expect-error
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
    const optSchema = schema(opt(array(string)));

    refute.exception(() => {
      optSchema([]);
    });
    refute.exception(() => {
      optSchema(['test']);
    });
    assert.exception(
      () => {
        // @ts-expect-error
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
    const optValidator = opt(validator(fake));

    optValidator('test');

    assert.calledOnceWith(fake, 'test');
  });

  it('fails if value is invalid', () => {
    const optSchema = schema(opt(string));

    assert.exception(
      () => {
        // @ts-expect-error
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
        // @ts-expect-error
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
        // @ts-expect-error
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
        // @ts-expect-error
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
    const optSchema = schema(
      object({
        name: string,
        age: opt(integer)
      })
    );

    const json = optSchema.write({ name: 'Max' });

    assert.json(JSON.stringify(json), { name: 'Max' });
  });

  it('does not fail to delete', () => {
    const optSchema = schema(
      object({
        age: opt(integer)
      })
    );

    const json = optSchema.write({ age: 41 });

    refute.exception(() => {
      delete json.age;
    });
  });

  it('fails to assign undefined', () => {
    const optSchema = schema(
      object({
        age: opt(integer)
      })
    );

    const json = optSchema.write({ age: 41 });

    assert.exception(
      () => {
        // @ts-expect-error
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
    const optSchema = schema(
      object({
        age: opt(integer)
      })
    );

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
    const optSchema = schema(
      object({
        age: opt(integer)
      })
    );

    assert.exception(
      () => {
        // @ts-expect-error
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
    const optSchema = schema(
      object({
        age: opt(integer)
      })
    );

    assert.exception(
      () => {
        // @ts-expect-error
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
    const optSchema = schema(opt(validator(() => false)));

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
    const optSchema = schema(opt(validator(() => false)));

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
    const optSchema = schema(opt(object({ index: integer })));

    assert.exception(
      () => {
        // @ts-expect-error
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
    const optSchema = schema(opt(object({ test: number })));

    const proxy = optSchema.read({ test: 42 });

    assert.exception(
      () => {
        // @ts-expect-error
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
    const optSchema = schema(opt(object({ test: number })));

    const proxy = optSchema.write({ test: 1 });

    assert.exception(
      () => {
        // @ts-expect-error
        return proxy.foo;
      },
      {
        name: 'ReferenceError',
        message: 'Invalid property "foo"',
        code: 'E_SCHEMA'
      }
    );
  });
});
