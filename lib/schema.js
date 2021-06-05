'use strict';

const { typeOf } = require('./type-of');
const { failSpec } = require('./fail');
const { validator } = require('./validator');
const { specTests } = require('./spec-test');
const { objectVerifyer } = require('./object-verifyer');

exports.schema = schema;

const schema_type = {
  Object: (spec) => objectVerifyer(specTests(spec)),
  Function: (spec) => spec.verify || validator(spec).verify
};

function schema(spec) {
  return (schema_type[typeOf(spec)] || failSpec)(spec);
}
