'use strict';

const { typeOf } = require('./type-of');
const { verifyer } = require('./verifyer');

const type = {
  null: (v) => v === null,
  defined: (v) => v !== undefined,
  optional: () => {},
  boolean: (v) => typeof v === 'boolean',
  number: (v) => typeof v === 'number' && isFinite(v),
  integer: (v) => typeof v === 'number' && isFinite(v) && Math.floor(v) === v,
  string: (v) => typeof v === 'string',
  object: (v) => typeOf(v) === 'Object',
  array: (v) => typeOf(v) === 'Array'
};

Object.keys(type).forEach(key => (type[key].verify = verifyer(type[key], key)));

exports.type = type;
