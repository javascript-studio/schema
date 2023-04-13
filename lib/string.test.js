'use strict';

const { assert } = require('@sinonjs/referee-sinon');
const { schema } = require('..');
const { string } = require('./string');

describe('string', () => {
  it('is exposed on schema', () => {
    assert.same(schema.string, string);
  });

  it('returns true for string values', () => {
    assert.isTrue(string(''));
    assert.isTrue(string('test'));
  });

  it('returns false for non-string values', () => {
    // @ts-expect-error
    assert.isFalse(string(undefined));
    // @ts-expect-error
    assert.isFalse(string(null));
    // @ts-expect-error
    assert.isFalse(string(0));
    // @ts-expect-error
    assert.isFalse(string(1));
    // @ts-expect-error
    assert.isFalse(string(true));
    // @ts-expect-error
    assert.isFalse(string({}));
    // @ts-expect-error
    assert.isFalse(string([]));
  });

  it('has type "string"', () => {
    assert.equals(string.type, 'string');
  });

  context('verify', () => {
    it('returns the value for string values', () => {
      assert.equals(string.verify(''), '');
      assert.equals(string.verify('test'), 'test');
    });

    it('throws for non string values', () => {
      assert.exception(
        () => {
          // @ts-expect-error
          string.verify(0);
        },
        {
          name: 'TypeError',
          code: 'E_SCHEMA',
          message: 'Expected string but got 0'
        }
      );
      assert.exception(
        () => {
          // @ts-expect-error
          string.verify(false);
        },
        {
          name: 'TypeError',
          code: 'E_SCHEMA',
          message: 'Expected string but got false'
        }
      );
    });

    it('throws with given path in message', () => {
      assert.exception(
        () => {
          // @ts-expect-error
          string.verify(null, {}, 'some.path');
        },
        {
          name: 'TypeError',
          code: 'E_SCHEMA',
          message: 'Expected property "some.path" to be string but got null'
        }
      );
    });

    it('throws with given error code', () => {
      assert.exception(
        () => {
          // @ts-expect-error
          string.verify(null, { error_code: 'INVALID' });
        },
        {
          code: 'INVALID'
        }
      );
    });
  });

  context('regexp', () => {
    const validator = string.regexp(/[0-9]+/);

    it('returns true for matching string', () => {
      assert.isTrue(validator('0'));
      assert.isTrue(validator('42'));
    });

    it('returns false for non-matching string', () => {
      assert.isFalse(validator(''));
      assert.isFalse(validator('abc'));
    });

    it('has type "string"', () => {
      assert.equals(validator.type, 'string');
    });

    context('verify', () => {
      it('returns a valid string', () => {
        assert.equals(validator.verify('123'), '123');
      });

      it('throws for an invalid string', () => {
        assert.exception(
          () => {
            validator.verify('abcd');
          },
          {
            name: 'TypeError',
            code: 'E_SCHEMA',
            message: 'Expected string matching /[0-9]+/ but got "abcd"'
          }
        );
      });
    });
  });

  context('length.min.verify', () => {
    const string_length = string.length.min(5);

    it('returns the value for number values >= min', () => {
      assert.equals(string_length.verify('abcdef'), 'abcdef');
      assert.equals(string_length.verify('1234567'), '1234567');
    });

    it('throws for string with length < 5', () => {
      assert.exception(
        () => {
          string_length.verify('abcd');
        },
        {
          name: 'TypeError',
          code: 'E_SCHEMA',
          message: 'Expected string with length >= 5 but got "abcd"'
        }
      );
    });

    it('has type "string"', () => {
      assert.equals(string_length.type, 'string');
    });
  });

  context('length.max.verify', () => {
    const string_length = string.length.max(5);

    it('returns the value for number values <= max', () => {
      assert.equals(string_length.verify(''), '');
      assert.equals(string_length.verify('a'), 'a');
      assert.equals(string_length.verify('abcde'), 'abcde');
    });

    it('throws for string with length > 5', () => {
      assert.exception(
        () => {
          string_length.verify('abcdef');
        },
        {
          name: 'TypeError',
          code: 'E_SCHEMA',
          message: 'Expected string with length <= 5 but got "abcdef"'
        }
      );
    });

    it('has type "string"', () => {
      assert.equals(string_length.type, 'string');
    });
  });

  context('length.range.verify', () => {
    const string_length = string.length.range(2, 5);

    it('returns the value for number values >= min and <= max', () => {
      assert.equals(string_length.verify('ab'), 'ab');
      assert.equals(string_length.verify('abc'), 'abc');
      assert.equals(string_length.verify('abcde'), 'abcde');
    });

    it('throws for string with length < 2', () => {
      assert.exception(
        () => {
          string_length.verify('a');
        },
        {
          name: 'TypeError',
          code: 'E_SCHEMA',
          message: 'Expected string with length >= 2 and <= 5 but got "a"'
        }
      );
    });

    it('throws for string with length > 5', () => {
      assert.exception(
        () => {
          string_length.verify('abcdef');
        },
        {
          name: 'TypeError',
          code: 'E_SCHEMA',
          message: 'Expected string with length >= 2 and <= 5 but got "abcdef"'
        }
      );

      it('has type "string"', () => {
        assert.equals(string_length.type, 'string');
      });
    });
  });
});
