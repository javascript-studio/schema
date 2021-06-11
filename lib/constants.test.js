'use strict';

const { assert } = require('@sinonjs/referee-sinon');
const { E_SCHEMA } = require('./constants');

describe('constants', () => {
  describe('E_SCHEMA', () => {
    it('is the string "E_SCHEMA"', () => {
      assert.equals(E_SCHEMA, 'E_SCHEMA');
    });
  });
});
