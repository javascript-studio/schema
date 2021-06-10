'use strict';

const { assert, refute } = require('@sinonjs/referee-sinon');
const { schema, literal } = require('..');

describe('literal', () => {
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
        literalSchema(7);
      },
      {
        name: 'TypeError',
        message: 'Expected 42 but got 7',
        code: 'SCHEMA_VALIDATION'
      }
    );
    assert.exception(
      () => {
        literalSchema('test');
      },
      {
        name: 'TypeError',
        message: 'Expected 42 but got "test"',
        code: 'SCHEMA_VALIDATION'
      }
    );
    assert.exception(
      () => {
        literalSchema({});
      },
      {
        name: 'TypeError',
        message: 'Expected 42 but got {}',
        code: 'SCHEMA_VALIDATION'
      }
    );
  });

  it('fails for single primitive string', () => {
    const literalSchema = schema(literal('test'));

    assert.exception(
      () => {
        literalSchema('');
      },
      {
        name: 'TypeError',
        message: 'Expected "test" but got ""',
        code: 'SCHEMA_VALIDATION'
      }
    );
    assert.exception(
      () => {
        literalSchema('tes');
      },
      {
        name: 'TypeError',
        message: 'Expected "test" but got "tes"',
        code: 'SCHEMA_VALIDATION'
      }
    );
    assert.exception(
      () => {
        literalSchema(42);
      },
      {
        name: 'TypeError',
        message: 'Expected "test" but got 42',
        code: 'SCHEMA_VALIDATION'
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
        literalSchema(1);
      },
      {
        name: 'TypeError',
        message: 'Expected 2, 3, 7 or 42 but got 1',
        code: 'SCHEMA_VALIDATION'
      }
    );
    assert.exception(
      () => {
        literalSchema(5);
      },
      {
        name: 'TypeError',
        message: 'Expected 2, 3, 7 or 42 but got 5',
        code: 'SCHEMA_VALIDATION'
      }
    );
    assert.exception(
      () => {
        literalSchema(43);
      },
      {
        name: 'TypeError',
        message: 'Expected 2, 3, 7 or 42 but got 43',
        code: 'SCHEMA_VALIDATION'
      }
    );
    assert.exception(
      () => {
        literalSchema('test');
      },
      {
        name: 'TypeError',
        message: 'Expected 2, 3, 7 or 42 but got "test"',
        code: 'SCHEMA_VALIDATION'
      }
    );
  });

  it('fails for list of primitive strings', () => {
    const literalSchema = schema(literal('yes', 'no', 'maybe'));

    assert.exception(
      () => {
        literalSchema('');
      },
      {
        name: 'TypeError',
        message: 'Expected "yes", "no" or "maybe" but got ""',
        code: 'SCHEMA_VALIDATION'
      }
    );
    assert.exception(
      () => {
        literalSchema('NO');
      },
      {
        name: 'TypeError',
        message: 'Expected "yes", "no" or "maybe" but got "NO"',
        code: 'SCHEMA_VALIDATION'
      }
    );
    assert.exception(
      () => {
        literalSchema(42);
      },
      {
        name: 'TypeError',
        message: 'Expected "yes", "no" or "maybe" but got 42',
        code: 'SCHEMA_VALIDATION'
      }
    );
  });
});
