/*eslint-env mocha*/
'use strict';

const { assert } = require('@sinonjs/referee-sinon');
const { SCHEMA_VALIDATION, RAW_SYMBOL } = require('../lib/constants');

describe('constants', () => {
  describe('SCHEMA_VALIDATION', () => {
    it('is the string "SCHEMA_VALIDATION"', () => {
      assert.equals(SCHEMA_VALIDATION, 'SCHEMA_VALIDATION');
    });
  });

  describe('RAW_SYMBOL', () => {
    it('is the Symbol "RAW_SYMBOL"', () => {
      assert.isSymbol(RAW_SYMBOL);
      assert.equals(RAW_SYMBOL.toString(), 'Symbol(raw)');
    });
  });
});
