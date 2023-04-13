'use strict';

const { assert, refute } = require('@sinonjs/referee-sinon');
const { schema, literal } = require('..');

describe('literal', () => {
  it('has type "literal"', () => {
    const validator = literal(null);

    assert.equals(validator.type, 'literal');
  });

  it('exposes frozen values', () => {
    const values = [1, 2, 3];

    const validator = literal(...values);

    assert.equals(validator.values, values);
    assert.isTrue(Object.isFrozen(validator.values));
  });

  it('throws if no arguments are given', () => {
    assert.exception(
      () => {
        literal();
      },
      {
        name: 'Error',
        message: 'Require at least one argument'
      }
    );
  });

  it('returns true if argument is in literal values', () => {
    const validator = literal(true, 42, 'test');

    assert.isTrue(validator(true));
    assert.isTrue(validator(42));
    assert.isTrue(validator('test'));
  });

  it('returns false if argument is not in literal values', () => {
    const validator = literal(true, 42, 'test');

    // @ts-expect-error
    assert.isFalse(validator(false));
    // @ts-expect-error
    assert.isFalse(validator(7));
    // @ts-expect-error
    assert.isFalse(validator('other'));
    // @ts-expect-error
    assert.isFalse(validator({}));
  });

  it('does not fail for single primitive number', () => {
    const literalSchema = schema(literal(42));

    refute.exception(() => {
      literalSchema(42);
    });
  });

  it('does not fail for single primitive string', () => {
    const literalSchema = schema(literal('test'));

    refute.exception(() => {
      literalSchema('test');
    });
  });

  it('fails for single primitive number', () => {
    const literalSchema = schema(literal(42));

    assert.exception(
      () => {
        // @ts-expect-error
        literalSchema(7);
      },
      {
        name: 'TypeError',
        message: 'Expected 42 but got 7',
        code: 'E_SCHEMA'
      }
    );
    assert.exception(
      () => {
        // @ts-expect-error
        literalSchema('test');
      },
      {
        name: 'TypeError',
        message: 'Expected 42 but got "test"',
        code: 'E_SCHEMA'
      }
    );
    assert.exception(
      () => {
        // @ts-expect-error
        literalSchema({});
      },
      {
        name: 'TypeError',
        message: 'Expected 42 but got {}',
        code: 'E_SCHEMA'
      }
    );
  });

  it('fails for single primitive string', () => {
    const literalSchema = schema(literal('test'));

    assert.exception(
      () => {
        // @ts-expect-error
        literalSchema('');
      },
      {
        name: 'TypeError',
        message: 'Expected "test" but got ""',
        code: 'E_SCHEMA'
      }
    );
    assert.exception(
      () => {
        // @ts-expect-error
        literalSchema('tes');
      },
      {
        name: 'TypeError',
        message: 'Expected "test" but got "tes"',
        code: 'E_SCHEMA'
      }
    );
    assert.exception(
      () => {
        // @ts-expect-error
        literalSchema(42);
      },
      {
        name: 'TypeError',
        message: 'Expected "test" but got 42',
        code: 'E_SCHEMA'
      }
    );
  });

  it('does not fail for list of primitive numbers', () => {
    const literalSchema = schema(literal(2, 3, 7, 42));

    refute.exception(() => {
      literalSchema(2);
      literalSchema(3);
      literalSchema(7);
      literalSchema(42);
    });
  });

  it('does not fail for list of primitive strings', () => {
    const literalSchema = schema(literal('yes', 'no', 'maybe'));

    refute.exception(() => {
      literalSchema('yes');
      literalSchema('no');
      literalSchema('maybe');
    });
  });

  it('fails for list of primitive numbers', () => {
    const literalSchema = schema(literal(2, 3, 7, 42));

    assert.exception(
      () => {
        // @ts-expect-error
        literalSchema(1);
      },
      {
        name: 'TypeError',
        message: 'Expected 2, 3, 7 or 42 but got 1',
        code: 'E_SCHEMA'
      }
    );
    assert.exception(
      () => {
        // @ts-expect-error
        literalSchema(5);
      },
      {
        name: 'TypeError',
        message: 'Expected 2, 3, 7 or 42 but got 5',
        code: 'E_SCHEMA'
      }
    );
    assert.exception(
      () => {
        // @ts-expect-error
        literalSchema(43);
      },
      {
        name: 'TypeError',
        message: 'Expected 2, 3, 7 or 42 but got 43',
        code: 'E_SCHEMA'
      }
    );
    assert.exception(
      () => {
        // @ts-expect-error
        literalSchema('test');
      },
      {
        name: 'TypeError',
        message: 'Expected 2, 3, 7 or 42 but got "test"',
        code: 'E_SCHEMA'
      }
    );
  });

  it('fails for list of primitive strings', () => {
    const literalSchema = schema(literal('yes', 'no', 'maybe'));

    assert.exception(
      () => {
        // @ts-expect-error
        literalSchema('');
      },
      {
        name: 'TypeError',
        message: 'Expected "yes", "no" or "maybe" but got ""',
        code: 'E_SCHEMA'
      }
    );
    assert.exception(
      () => {
        // @ts-expect-error
        literalSchema('NO');
      },
      {
        name: 'TypeError',
        message: 'Expected "yes", "no" or "maybe" but got "NO"',
        code: 'E_SCHEMA'
      }
    );
    assert.exception(
      () => {
        // @ts-expect-error
        literalSchema(42);
      },
      {
        name: 'TypeError',
        message: 'Expected "yes", "no" or "maybe" but got 42',
        code: 'E_SCHEMA'
      }
    );
  });
});
