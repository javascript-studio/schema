'use strict';

const { failNotSchemaObject } = require('./fail');

exports.raw = function (value) {
  const { toJSON } = value;
  if (!toJSON) {
    failNotSchemaObject();
  }
  return toJSON.call(value);
};

exports.unwrap = function (value) {
  const { toJSON } = value;
  return toJSON ? toJSON.call(value) : value;
};
