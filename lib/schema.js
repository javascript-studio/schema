'use strict';

const { lookup } = require('./registry');
const { copyPropertyDescriptor, copyTypeAndProperties } = require('./util');

exports.schema = schema;

function schema(spec, spec_options = {}) {
  const validator = lookup(spec, spec_options);
  const verifyer = createVerifyer(validator, spec_options);
  copyPropertyDescriptor(validator.verify, 'read', verifyer);
  copyPropertyDescriptor(validator.verify, 'write', verifyer);
  copyTypeAndProperties(validator, verifyer);
  verifyer.verify = validator.verify.verify;
  return verifyer;
}

function createVerifyer(validator, spec_options) {
  return (value, options = spec_options) => validator.verify(value, options);
}
