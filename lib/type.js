'use strict';

const { typeOf } = require('./type-of');
const { validator } = require('./validator');

const type = {};

exports.type = type;

define('null', testNull);
define('defined', testDefined);
define('optional', testOptional);
define('boolean', testBoolean);
define('number', testNumber);
define('integer', testInteger);
define('string', testString);
define('object', testObject);
define('array', testArray);

function define(key, test) {
  type[key] = validator(test, key);
}

function testNull(v) {
  return v === null;
}

function testDefined(v) {
  return v !== undefined;
}

function testOptional() {
  // Everything is allowed
}

function testBoolean(v) {
  return typeof v === 'boolean';
}

function testNumber(v) {
  return typeof v === 'number' && isFinite(v);
}

function testInteger(v) {
  return typeof v === 'number' && isFinite(v) && Math.floor(v) === v;
}

function testString(v) {
  return typeof v === 'string';
}

function testObject(v) {
  return typeOf(v) === 'Object';
}

function testArray(v) {
  return typeOf(v) === 'Array';
}
