'use strict';

const { assert } = require('@sinonjs/referee-sinon');
const { schema } = require('..');
const { integer } = require('./integer');

describe('integer', () => {
  it('is exposed on schema', () => {
    assert.same(schema.integer, integer);
  });

  it('returns true for integer values', () => {
    assert.isTrue(integer(0));
    assert.isTrue(integer(1));
    assert.isTrue(integer(42));
    assert.isTrue(integer(-1));
  });

  it('returns false for non-integer values', () => {
    // @ts-expect-error
    assert.isFalse(integer(undefined));
    // @ts-expect-error
    assert.isFalse(integer(null));
    // @ts-expect-error
    assert.isFalse(integer(false));
    assert.isFalse(integer(0.5));
    assert.isFalse(integer(-0.5));
    // @ts-expect-error
    assert.isFalse(integer(''));
    // @ts-expect-error
    assert.isFalse(integer('test'));
    // @ts-expect-error
    assert.isFalse(integer({}));
    // @ts-expect-error
    assert.isFalse(integer([]));
  });

  it('returns false for non-finite number values', () => {
    assert.isFalse(integer(NaN));
    assert.isFalse(integer(Infinity));
    assert.isFalse(integer(-Infinity));
  });

  it('has type "integer"', () => {
    assert.equals(integer.type, 'integer');
  });

  context('min', () => {
    const min = integer.min(1);

    it('returns true if number is larger or equal', () => {
      assert.isTrue(min(1));
      assert.isTrue(min(42));
    });

    it('returns false if number is lower or float', () => {
      assert.isFalse(min(0));
      assert.isFalse(min(0.5));
      assert.isFalse(min(-0.5));
      assert.isFalse(min(1.5));
    });

    it('returns false if not a finite number', () => {
      assert.isFalse(min(NaN));
      assert.isFalse(min(Infinity));
      // @ts-expect-error
      assert.isFalse(min(undefined));
      // @ts-expect-error
      assert.isFalse(min({}));
    });

    it('has type "integer"', () => {
      assert.equals(min.type, 'integer');
    });
  });

  context('max', () => {
    const max = integer.max(1);

    it('returns true if number is lower or equal', () => {
      assert.isTrue(max(0));
      assert.isTrue(max(1));
    });

    it('returns false if number is larger or float', () => {
      assert.isFalse(max(1.5));
      assert.isFalse(max(2));
      assert.isFalse(max(42));
      assert.isFalse(max(0.5));
    });

    it('returns false if not a finite number', () => {
      assert.isFalse(max(NaN));
      assert.isFalse(max(Infinity));
      // @ts-expect-error
      assert.isFalse(max(undefined));
      // @ts-expect-error
      assert.isFalse(max({}));
    });

    it('has type "integer"', () => {
      assert.equals(max.type, 'integer');
    });
  });

  context('range', () => {
    const range = integer.range(1, 2);

    it('returns true if number is in range', () => {
      assert.isTrue(range(1));
      assert.isTrue(range(2));
    });

    it('returns false if number is larger or float', () => {
      assert.isFalse(range(0));
      assert.isFalse(range(0.5));
      assert.isFalse(range(2.5));
      assert.isFalse(range(3));
      assert.isFalse(range(42));
      assert.isFalse(range(1.5));
    });

    it('returns false if not a finite number', () => {
      assert.isFalse(range(NaN));
      assert.isFalse(range(Infinity));
      // @ts-expect-error
      assert.isFalse(range(undefined));
      // @ts-expect-error
      assert.isFalse(range({}));
    });

    it('has type "integer"', () => {
      assert.equals(range.type, 'integer');
    });
  });

  context('verify', () => {
    it('returns the value for number values', () => {
      assert.equals(integer.verify(0), 0);
      assert.equals(integer.verify(-1), -1);
      assert.equals(integer.verify(42), 42);
    });

    it('throws for non number values', () => {
      assert.exception(
        () => {
          // @ts-expect-error
          integer.verify(false);
        },
        {
          name: 'TypeError',
          code: 'E_SCHEMA',
          message: 'Expected integer but got false'
        }
      );
      assert.exception(
        () => {
          // @ts-expect-error
          integer.verify('test');
        },
        {
          name: 'TypeError',
          code: 'E_SCHEMA',
          message: 'Expected integer but got "test"'
        }
      );
      assert.exception(
        () => {
          integer.verify(0.5);
        },
        {
          name: 'TypeError',
          code: 'E_SCHEMA',
          message: 'Expected integer but got 0.5'
        }
      );
      assert.exception(
        () => {
          integer.verify(NaN);
        },
        {
          name: 'TypeError',
          code: 'E_SCHEMA',
          message: 'Expected integer but got NaN'
        }
      );
    });

    it('throws with given path in message', () => {
      assert.exception(
        () => {
          // @ts-expect-error
          integer.verify(null, {}, 'some.path');
        },
        {
          name: 'TypeError',
          code: 'E_SCHEMA',
          message: 'Expected property "some.path" to be integer but got null'
        }
      );
    });

    it('throws with given error code', () => {
      assert.exception(
        () => {
          // @ts-expect-error
          integer.verify(null, { error_code: 'INVALID' });
        },
        {
          code: 'INVALID'
        }
      );
    });
  });

  context('min.verify', () => {
    const min = integer.min(1);

    it('returns the value for number values >= min', () => {
      assert.equals(min.verify(1), 1);
      assert.equals(min.verify(42), 42);
    });

    it('throws for non number value', () => {
      assert.exception(
        () => {
          // @ts-expect-error
          min.verify(false);
        },
        {
          name: 'TypeError',
          code: 'E_SCHEMA',
          message: 'Expected integer >= 1 but got false'
        }
      );
    });

    it('throws for flaot number value', () => {
      assert.exception(
        () => {
          min.verify(1.5);
        },
        {
          name: 'TypeError',
          code: 'E_SCHEMA',
          message: 'Expected integer >= 1 but got 1.5'
        }
      );
    });

    it('throws for smaller number value', () => {
      assert.exception(
        () => {
          min.verify(0);
        },
        {
          name: 'TypeError',
          code: 'E_SCHEMA',
          message: 'Expected integer >= 1 but got 0'
        }
      );
    });
  });

  context('max.verify', () => {
    const max = integer.max(1);

    it('returns the value for number values <= max', () => {
      assert.equals(max.verify(0), 0);
      assert.equals(max.verify(1), 1);
      assert.equals(max.verify(-1), -1);
    });

    it('throws for non number value', () => {
      assert.exception(
        () => {
          // @ts-expect-error
          max.verify(false);
        },
        {
          name: 'TypeError',
          code: 'E_SCHEMA',
          message: 'Expected integer <= 1 but got false'
        }
      );
    });

    it('throws for float number value', () => {
      assert.exception(
        () => {
          max.verify(0.5);
        },
        {
          name: 'TypeError',
          code: 'E_SCHEMA',
          message: 'Expected integer <= 1 but got 0.5'
        }
      );
    });

    it('throws for greater number value', () => {
      assert.exception(
        () => {
          max.verify(2);
        },
        {
          name: 'TypeError',
          code: 'E_SCHEMA',
          message: 'Expected integer <= 1 but got 2'
        }
      );
    });
  });

  context('range.verify', () => {
    const range = integer.range(1, 2);

    it('returns the value for number values within range', () => {
      assert.equals(range.verify(1), 1);
      assert.equals(range.verify(2), 2);
    });

    it('throws for non number value', () => {
      assert.exception(
        () => {
          // @ts-expect-error
          range.verify(false);
        },
        {
          name: 'TypeError',
          code: 'E_SCHEMA',
          message: 'Expected integer >= 1 and <= 2 but got false'
        }
      );
    });

    it('throws for float number value', () => {
      assert.exception(
        () => {
          range.verify(1.5);
        },
        {
          name: 'TypeError',
          code: 'E_SCHEMA',
          message: 'Expected integer >= 1 and <= 2 but got 1.5'
        }
      );
    });

    it('throws for smaller number value', () => {
      assert.exception(
        () => {
          range.verify(0);
        },
        {
          name: 'TypeError',
          code: 'E_SCHEMA',
          message: 'Expected integer >= 1 and <= 2 but got 0'
        }
      );
    });

    it('throws for greater number value', () => {
      assert.exception(
        () => {
          range.verify(3);
        },
        {
          name: 'TypeError',
          code: 'E_SCHEMA',
          message: 'Expected integer >= 1 and <= 2 but got 3'
        }
      );
    });
  });
});
