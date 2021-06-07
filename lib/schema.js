'use strict';

const { lookup } = require('./registry');

exports.schema = schema;

function schema(spec) {
  return lookup(spec).verify;
}
