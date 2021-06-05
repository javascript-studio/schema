'use strict';

const { typeOf } = require('./type-of');
const { validator } = require('./validator');

const type = {};

exports.type = type;

define('object', testObject);
define('array', testArray);

function define(key, test) {
  type[key] = validator(test, key);
}

function testObject(v) {
  return typeOf(v) === 'Object';
}

function testArray(v) {
  return typeOf(v) === 'Array';
}
