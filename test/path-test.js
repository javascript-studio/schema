/*eslint-env mocha*/
'use strict';

const { assert } = require('@sinonjs/referee-sinon');
const { path } = require('../lib/path');

describe('path', () => {
  it('returns key if parent is null', () => {
    const p = path(null, 'key');

    assert.equals(p, 'key');
  });

  it('returns parent and key', () => {
    const p = path('parent', 'key');

    assert.equals(p, 'parent.key');
  });
});
