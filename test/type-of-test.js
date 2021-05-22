/*eslint-env mocha*/
'use strict';

const { assert } = require('@sinonjs/referee-sinon');
const { typeOf } = require('../lib/type-of');

describe('type-of', () => {
  it('returns Object for object', () => {
    const type = typeOf({});

    assert.equals(type, 'Object');
  });

  it('returns Function for function', () => {
    const type = typeOf(() => {});

    assert.equals(type, 'Function');
  });

  it('returns Array for array', () => {
    const type = typeOf([]);

    assert.equals(type, 'Array');
  });

  it('returns Arguments for arguments', () => {
    const type = typeOf(arguments);

    assert.equals(type, 'Arguments');
  });

  it('returns Number for number', () => {
    const type = typeOf(42);

    assert.equals(type, 'Number');
  });

  it('returns RegExp for regexp', () => {
    const type = typeOf(/[a-z]/);

    assert.equals(type, 'RegExp');
  });
});
