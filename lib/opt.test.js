'use strict';

const { assert, refute, sinon } = require('@sinonjs/referee-sinon');
const { schema, array, opt, boolean, number, integer, string } = require('..');

describe('opt', () => {
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
        message: 'Expected opt({yesno:boolean}) but got {"yesno":42}',
        code: 'SCHEMA_VALIDATION'
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
        message: 'Expected opt([string]) but got [42]',
        code: 'SCHEMA_VALIDATION'
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
        message: 'Expected opt([string]) but got [42]',
        code: 'SCHEMA_VALIDATION'
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
        message: 'Expected opt(string) but got 123',
        code: 'SCHEMA_VALIDATION'
      }
    );
    assert.exception(
      () => {
        optSchema(0);
      },
      {
        name: 'TypeError',
        message: 'Expected opt(string) but got 0',
        code: 'SCHEMA_VALIDATION'
      }
    );
    assert.exception(
      () => {
        optSchema(false);
      },
      {
        name: 'TypeError',
        message: 'Expected opt(string) but got false',
        code: 'SCHEMA_VALIDATION'
      }
    );
    assert.exception(
      () => {
        optSchema(true);
      },
      {
        name: 'TypeError',
        message: 'Expected opt(string) but got true',
        code: 'SCHEMA_VALIDATION'
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
        message: 'Expected property "age" to be opt(integer) but got ""',
        code: 'SCHEMA_VALIDATION'
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
        message: 'Expected property "age" to be opt(integer) but got NaN',
        code: 'SCHEMA_VALIDATION'
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
        message: 'Expected property "age" to be opt(integer) but got false',
        code: 'SCHEMA_VALIDATION'
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
        message: 'Expected property "age" to be opt(integer) but got true',
        code: 'SCHEMA_VALIDATION'
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
        message: 'Expected opt(<custom validator>) but got 1',
        code: 'SCHEMA_VALIDATION'
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
