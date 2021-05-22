'use strict';

exports.typeOf = typeOf;

const { toString } = Object.prototype;

function typeOf(value) {
  const str = toString.call(value);
  return str.substring(8, str.length - 1);
}
