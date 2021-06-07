'use strict';

const { specTest } = require('./spec-test');

exports.schema = schema;

function schema(spec) {
  return specTest(spec).verify;
}
