/*eslint-env mocha*/
'use strict';

const { assert } = require('@sinonjs/referee-sinon');
const { SCHEMA_VALIDATION } = require('../lib/constants');

describe('constants', () => {
  describe('SCHEMA_VALIDATION', () => {
    it('is the string "SCHEMA_VALIDATION"', () => {
      assert.equals(SCHEMA_VALIDATION, 'SCHEMA_VALIDATION');
    });
  });
});
