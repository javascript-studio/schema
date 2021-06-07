'use strict';

const { lookup } = require('./spec-test');

exports.schema = schema;

function schema(spec) {
  return lookup(spec).verify;
}
