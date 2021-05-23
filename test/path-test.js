/*eslint-env mocha*/
'use strict';

const { assert } = require('@sinonjs/referee-sinon');
const { objectPath, arrayPath } = require('../lib/path');

describe('objectPath', () => {
  it('returns key if parent is null', () => {
    const p = objectPath(null, 'key');

    assert.equals(p, 'key');
  });

  it('returns parent and key', () => {
    const p = objectPath('parent', 'key');

    assert.equals(p, 'parent.key');
  });
});

describe('arrayPath', () => {
  it('returns [index] if parent is null', () => {
    const p = arrayPath(null, 0);

    assert.equals(p, '[0]');
  });

  it('returns parent and [index]', () => {
    const p = arrayPath('parent', 1);

    assert.equals(p, 'parent[1]');
  });
});
