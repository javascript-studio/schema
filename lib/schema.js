'use strict';

const { typeOf } = require('./type-of');
const { SCHEMA_VALIDATION } = require('./constants');
const {
  failSpec
} = require('./fail');
const { verifyer } = require('./verifyer');
const { specTests } = require('./spec-test');
const { opt } = require('./opt');
const { one } = require('./one');
const { object, objectVerifyer } = require('./object');
const { array } = require('./array');
const { map } = require('./map');

const schema_type = {
  Object: spec => objectVerifyer(specTests(spec)),
  Function: spec => spec.verify || verifyer(spec, spec)
};

function schema(spec) {
  return (schema_type[typeOf(spec)] || failSpec)(spec);
}

schema.spec = schema;

schema.opt = opt;

schema.one = one;

schema.object = object;

schema.array = array;

schema.map = map;

schema.SCHEMA_VALIDATION = SCHEMA_VALIDATION;

module.exports = schema;
