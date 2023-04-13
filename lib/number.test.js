'use strict';

const { assert } = require('@sinonjs/referee-sinon');
const { schema } = require('..');
const { number } = require('./number');

describe('number', () => {
  it('is exposed on schema', () => {
    assert.same(schema.number, number);
  });

  it('returns true for number values', () => {
    assert.isTrue(number(0));
    assert.isTrue(number(0.5));
    assert.isTrue(number(1));
    assert.isTrue(number(42));
    assert.isTrue(number(-0.5));
    assert.isTrue(number(-1));
  });

  it('returns false for non-number values', () => {
    // @ts-expect-error
    assert.isFalse(number(undefined));
    // @ts-expect-error
    assert.isFalse(number(null));
    // @ts-expect-error
    assert.isFalse(number(false));
    // @ts-expect-error
    assert.isFalse(number(''));
    // @ts-expect-error
    assert.isFalse(number('test'));
    // @ts-expect-error
    assert.isFalse(number({}));
    // @ts-expect-error
    assert.isFalse(number([]));
  });

  it('returns false for non-finite number values', () => {
    assert.isFalse(number(NaN));
    assert.isFalse(number(Infinity));
    assert.isFalse(number(-Infinity));
  });

  it('has type "number"', () => {
    assert.equals(number.type, 'number');
  });

  context('min', () => {
    const min = number.min(1);

    it('returns true if number is larger or equal', () => {
      assert.isTrue(min(1));
      assert.isTrue(min(1.5));
      assert.isTrue(min(42));
    });

    it('returns false if number is lower', () => {
      assert.isFalse(min(0));
      assert.isFalse(min(0.5));
      assert.isFalse(min(-0.5));
    });

    it('returns false if not a finite number', () => {
      assert.isFalse(min(NaN));
      assert.isFalse(min(Infinity));
      // @ts-expect-error
      assert.isFalse(min(undefined));
      // @ts-expect-error
      assert.isFalse(min({}));
    });

    it('has type "number"', () => {
      assert.equals(min.type, 'number');
    });
  });

  context('max', () => {
    const max = number.max(1);

    it('returns true if number is lower or equal', () => {
      assert.isTrue(max(0));
      assert.isTrue(max(0.5));
      assert.isTrue(max(1));
    });

    it('returns false if number is larger', () => {
      assert.isFalse(max(1.5));
      assert.isFalse(max(2));
      assert.isFalse(max(42));
    });

    it('returns false if not a finite number', () => {
      assert.isFalse(max(NaN));
      assert.isFalse(max(Infinity));
      // @ts-expect-error
      assert.isFalse(max(undefined));
      // @ts-expect-error
      assert.isFalse(max({}));
    });

    it('has type "number"', () => {
      assert.equals(max.type, 'number');
    });
  });

  context('range', () => {
    const range = number.range(1, 2);

    it('returns true if number is in range', () => {
      assert.isTrue(range(1));
      assert.isTrue(range(1.5));
      assert.isTrue(range(2));
    });

    it('returns false if number is larger', () => {
      assert.isFalse(range(0));
      assert.isFalse(range(0.5));
      assert.isFalse(range(2.5));
      assert.isFalse(range(3));
      assert.isFalse(range(42));
    });

    it('returns false if not a finite number', () => {
      assert.isFalse(range(NaN));
      assert.isFalse(range(Infinity));
      // @ts-expect-error
      assert.isFalse(range(undefined));
      // @ts-expect-error
      assert.isFalse(range({}));
    });

    it('has type "number"', () => {
      assert.equals(range.type, 'number');
    });
  });

  context('verify', () => {
    it('returns the value for number values', () => {
      assert.equals(number.verify(0), 0);
      assert.equals(number.verify(0.5), 0.5);
      assert.equals(number.verify(-1), -1);
      assert.equals(number.verify(42), 42);
    });

    it('throws for non number values', () => {
      assert.exception(
        () => {
          // @ts-expect-error
          number.verify(false);
        },
        {
          name: 'TypeError',
          code: 'E_SCHEMA',
          message: 'Expected number but got false'
        }
      );
      assert.exception(
        () => {
          // @ts-expect-error
          number.verify('test');
        },
        {
          name: 'TypeError',
          code: 'E_SCHEMA',
          message: 'Expected number but got "test"'
        }
      );
      assert.exception(
        () => {
          number.verify(NaN);
        },
        {
          name: 'TypeError',
          code: 'E_SCHEMA',
          message: 'Expected number but got NaN'
        }
      );
    });

    it('throws with given path in message', () => {
      assert.exception(
        () => {
          // @ts-expect-error
          number.verify(null, {}, 'some.path');
        },
        {
          name: 'TypeError',
          code: 'E_SCHEMA',
          message: 'Expected property "some.path" to be number but got null'
        }
      );
    });

    it('throws with given error code', () => {
      assert.exception(
        () => {
          // @ts-expect-error
          number.verify(null, { error_code: 'INVALID' });
        },
        {
          code: 'INVALID'
        }
      );
    });
  });

  context('min.verify', () => {
    const min = number.min(1);

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
          message: 'Expected number >= 1 but got false'
        }
      );
    });

    it('throws for smaller number value', () => {
      assert.exception(
        () => {
          min.verify(0.5);
        },
        {
          name: 'TypeError',
          code: 'E_SCHEMA',
          message: 'Expected number >= 1 but got 0.5'
        }
      );
    });
  });

  context('max.verify', () => {
    const max = number.max(1);

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
          message: 'Expected number <= 1 but got false'
        }
      );
    });

    it('throws for greater number value', () => {
      assert.exception(
        () => {
          max.verify(1.5);
        },
        {
          name: 'TypeError',
          code: 'E_SCHEMA',
          message: 'Expected number <= 1 but got 1.5'
        }
      );
    });
  });

  context('range.verify', () => {
    const range = number.range(1, 2);

    it('returns the value for number values within range', () => {
      assert.equals(range.verify(1), 1);
      assert.equals(range.verify(1.5), 1.5);
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
          message: 'Expected number >= 1 and <= 2 but got false'
        }
      );
    });

    it('throws for smaller number value', () => {
      assert.exception(
        () => {
          range.verify(0.5);
        },
        {
          name: 'TypeError',
          code: 'E_SCHEMA',
          message: 'Expected number >= 1 and <= 2 but got 0.5'
        }
      );
    });

    it('throws for greater number value', () => {
      assert.exception(
        () => {
          range.verify(2.5);
        },
        {
          name: 'TypeError',
          code: 'E_SCHEMA',
          message: 'Expected number >= 1 and <= 2 but got 2.5'
        }
      );
    });
  });
});
