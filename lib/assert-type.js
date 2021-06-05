'use strict';

const { typeOf } = require('./type-of');
const { failType } = require('./fail');

exports.assertType = assertType;

function assertType(value, type, base) {
  if (typeOf(value) !== type) {
    failType(type, value, base);
  }
}
