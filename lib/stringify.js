'use strict';

const { typeOf } = require('./type-of');

exports.stringify = stringify;

const serialize = {
  Function: () => 'function',
  Number: String, // NaN and Infinity
  RegExp: String,
  Arguments: String
};

function stringify(value) {
  return (serialize[typeOf(value)] || JSON.stringify)(value);
}
