'use strict';

const { assert } = require('@sinonjs/referee-sinon');
const { stringify } = require('../lib/stringify');

describe('stringify', () => {
  it('returns object as JSON string', () => {
    const type = stringify({ key: 'value' });

    assert.equals(type, '{"key":"value"}');
  });

  it('returns "function" for function', () => {
    const type = stringify(() => {});

    assert.equals(type, 'function');
  });

  it('returns array as JSON string', () => {
    const type = stringify(['test', 42, { key: 'value' }]);

    assert.equals(type, '["test",42,{"key":"value"}]');
  });

  it('returns "[object Arguments]" for arguments', () => {
    const type = stringify(arguments);

    assert.equals(type, '[object Arguments]');
  });

  it('returns string as quoted string', () => {
    const type = stringify('test "with quotes"');

    assert.equals(type, '"test \\"with quotes\\""');
  });

  it('returns number as string', () => {
    const type = stringify(42);

    assert.equals(type, '42');
  });

  it('returns NaN as string', () => {
    const type = stringify(NaN);

    assert.equals(type, 'NaN');
  });

  it('returns Infinity as string', () => {
    const type = stringify(Infinity);

    assert.equals(type, 'Infinity');
  });

  it('returns regexp as string', () => {
    const type = stringify(/[a-z]/i);

    assert.equals(type, '/[a-z]/i');
  });
});
