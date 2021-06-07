'use strict';

const { typeOf, failSpec } = require('./util');
const { validator } = require('./validator');
const { specTests } = require('./spec-test');
const { objectVerifyer } = require('./object-verifyer');

exports.schema = schema;

const schema_type = {
  Object: (spec) => objectVerifyer(specTests(spec)),
  Function: (spec) => spec.verify || validator(spec, spec.name).verify
};

function schema(spec) {
  return (schema_type[typeOf(spec)] || failSpec)(spec);
}
