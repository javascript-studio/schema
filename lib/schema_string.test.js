'use strict';

const { assert, refute } = require('@sinonjs/referee-sinon');
const { schema } = require('..');

describe('schema string', () => {
  it('validates null', () => {
    const stringSchema = schema({ test: 'null' });

    refute.exception(() => {
      stringSchema({ test: null });
    });
    assert.exception(
      () => {
        stringSchema({ test: undefined });
      },
      {
        name: 'TypeError',
        message: 'Expected property "test" to be null but got undefined',
        code: 'SCHEMA_VALIDATION'
      }
    );
    assert.exception(
      () => {
        stringSchema({ test: 'test' });
      },
      {
        name: 'TypeError',
        message: 'Expected property "test" to be null but got "test"',
        code: 'SCHEMA_VALIDATION'
      }
    );
  });

  it('validates defined', () => {
    const stringSchema = schema({ test: 'defined' });

    refute.exception(() => {
      stringSchema({ test: null });
    });
    refute.exception(() => {
      stringSchema({ test: 'test' });
    });
    assert.exception(
      () => {
        stringSchema({});
      },
      {
        name: 'TypeError',
        message: 'Expected property "test" to be defined but got undefined',
        code: 'SCHEMA_VALIDATION'
      }
    );
    assert.exception(
      () => {
        stringSchema({ test: undefined });
      },
      {
        name: 'TypeError',
        message: 'Expected property "test" to be defined but got undefined',
        code: 'SCHEMA_VALIDATION'
      }
    );
  });

  it('validates optional', () => {
    const stringSchema = schema({ test: 'optional' });

    refute.exception(() => {
      stringSchema({});
    });
    refute.exception(() => {
      stringSchema({ test: undefined });
    });
    refute.exception(() => {
      stringSchema({ test: null });
    });
    refute.exception(() => {
      stringSchema({ test: 'test' });
    });
  });

  it('validates boolean', () => {
    const stringSchema = schema({ test: 'boolean' });

    refute.exception(() => {
      stringSchema({ test: true });
      stringSchema({ test: false });
    });
    assert.exception(
      () => {
        stringSchema({ test: 1 });
      },
      {
        name: 'TypeError',
        message: 'Expected property "test" to be boolean but got 1',
        code: 'SCHEMA_VALIDATION'
      }
    );
    assert.exception(
      () => {
        stringSchema({ test: 'test' });
      },
      {
        name: 'TypeError',
        message: 'Expected property "test" to be boolean but got "test"',
        code: 'SCHEMA_VALIDATION'
      }
    );
  });

  it('validates number', () => {
    const stringSchema = schema({ test: 'number' });

    refute.exception(() => {
      stringSchema({ test: 0 });
      stringSchema({ test: -1 });
      stringSchema({ test: 1 });
      stringSchema({ test: 99999 });
      stringSchema({ test: 1.5 });
    });
    assert.exception(
      () => {
        stringSchema({ test: true });
      },
      {
        name: 'TypeError',
        message: 'Expected property "test" to be number but got true',
        code: 'SCHEMA_VALIDATION'
      }
    );
    assert.exception(
      () => {
        stringSchema({ test: 'test' });
      },
      {
        name: 'TypeError',
        message: 'Expected property "test" to be number but got "test"',
        code: 'SCHEMA_VALIDATION'
      }
    );
    assert.exception(
      () => {
        stringSchema({ test: Infinity });
      },
      {
        name: 'TypeError',
        message: 'Expected property "test" to be number but got Infinity',
        code: 'SCHEMA_VALIDATION'
      }
    );
    assert.exception(
      () => {
        stringSchema({ test: NaN });
      },
      {
        name: 'TypeError',
        message: 'Expected property "test" to be number but got NaN',
        code: 'SCHEMA_VALIDATION'
      }
    );
  });

  it('validates integer', () => {
    const stringSchema = schema({ test: 'integer' });

    refute.exception(() => {
      stringSchema({ test: 0 });
      stringSchema({ test: -1 });
      stringSchema({ test: 1 });
      stringSchema({ test: 99999 });
    });
    assert.exception(
      () => {
        stringSchema({ test: 1.5 });
      },
      {
        name: 'TypeError',
        message: 'Expected property "test" to be integer but got 1.5',
        code: 'SCHEMA_VALIDATION'
      }
    );
    assert.exception(
      () => {
        stringSchema({ test: true });
      },
      {
        name: 'TypeError',
        message: 'Expected property "test" to be integer but got true',
        code: 'SCHEMA_VALIDATION'
      }
    );
    assert.exception(
      () => {
        stringSchema({ test: 'test' });
      },
      {
        name: 'TypeError',
        message: 'Expected property "test" to be integer but got "test"',
        code: 'SCHEMA_VALIDATION'
      }
    );
    assert.exception(
      () => {
        stringSchema({ test: Infinity });
      },
      {
        name: 'TypeError',
        message: 'Expected property "test" to be integer but got Infinity',
        code: 'SCHEMA_VALIDATION'
      }
    );
    assert.exception(
      () => {
        stringSchema({ test: NaN });
      },
      {
        name: 'TypeError',
        message: 'Expected property "test" to be integer but got NaN',
        code: 'SCHEMA_VALIDATION'
      }
    );
  });

  it('validates string', () => {
    const stringSchema = schema({ test: 'string' });

    refute.exception(() => {
      stringSchema({ test: '' });
      stringSchema({ test: 'test' });
    });
    assert.exception(
      () => {
        stringSchema({ test: true });
      },
      {
        name: 'TypeError',
        message: 'Expected property "test" to be string but got true',
        code: 'SCHEMA_VALIDATION'
      }
    );
    assert.exception(
      () => {
        stringSchema({ test: 0 });
      },
      {
        name: 'TypeError',
        message: 'Expected property "test" to be string but got 0',
        code: 'SCHEMA_VALIDATION'
      }
    );
  });

  it('validates object', () => {
    const stringSchema = schema({ test: 'object' });

    refute.exception(() => {
      stringSchema({ test: {} });
    });
    assert.exception(
      () => {
        stringSchema({ test: null });
      },
      {
        name: 'TypeError',
        message: 'Expected property "test" to be object but got null',
        code: 'SCHEMA_VALIDATION'
      }
    );
    assert.exception(
      () => {
        stringSchema({ test: true });
      },
      {
        name: 'TypeError',
        message: 'Expected property "test" to be object but got true',
        code: 'SCHEMA_VALIDATION'
      }
    );
    assert.exception(
      () => {
        stringSchema({ test: 'test' });
      },
      {
        name: 'TypeError',
        message: 'Expected property "test" to be object but got "test"',
        code: 'SCHEMA_VALIDATION'
      }
    );
    assert.exception(
      () => {
        stringSchema({ test: [] });
      },
      {
        name: 'TypeError',
        message: 'Expected property "test" to be object but got []',
        code: 'SCHEMA_VALIDATION'
      }
    );
    assert.exception(
      () => {
        stringSchema({ test: /[a-z]/ });
      },
      {
        name: 'TypeError',
        message: 'Expected property "test" to be object but got /[a-z]/',
        code: 'SCHEMA_VALIDATION'
      }
    );
  });

  it('validates array', () => {
    const stringSchema = schema({ test: 'array' });

    refute.exception(() => {
      stringSchema({ test: [] });
    });
    assert.exception(
      () => {
        stringSchema({ test: null });
      },
      {
        name: 'TypeError',
        message: 'Expected property "test" to be array but got null',
        code: 'SCHEMA_VALIDATION'
      }
    );
    assert.exception(
      () => {
        stringSchema({ test: true });
      },
      {
        name: 'TypeError',
        message: 'Expected property "test" to be array but got true',
        code: 'SCHEMA_VALIDATION'
      }
    );
    assert.exception(
      () => {
        stringSchema({ test: 'test' });
      },
      {
        name: 'TypeError',
        message: 'Expected property "test" to be array but got "test"',
        code: 'SCHEMA_VALIDATION'
      }
    );
    assert.exception(
      () => {
        stringSchema({ test: {} });
      },
      {
        name: 'TypeError',
        message: 'Expected property "test" to be array but got {}',
        code: 'SCHEMA_VALIDATION'
      }
    );
    assert.exception(
      () => {
        stringSchema({ test: /[a-z]/ });
      },
      {
        name: 'TypeError',
        message: 'Expected property "test" to be array but got /[a-z]/',
        code: 'SCHEMA_VALIDATION'
      }
    );
    function argumentsTest() {
      stringSchema({ test: arguments });
    }
    assert.exception(
      () => {
        argumentsTest(1, 2);
      },
      {
        name: 'TypeError',
        message:
          'Expected property "test" to be array but got ' +
          '[object Arguments]',
        code: 'SCHEMA_VALIDATION'
      }
    );
  });

  it('fails on unknown string', () => {
    assert.exception(
      () => {
        schema({ test: 'unknown' });
      },
      {
        name: 'Error',
        message: 'Invalid spec "unknown"'
      }
    );
  });

  it('returns given object', () => {
    const stringSchema = schema({ test: 'string' });
    const object = { test: 'something' };

    const returned = stringSchema(object);

    assert.same(returned, object);
  });
});
