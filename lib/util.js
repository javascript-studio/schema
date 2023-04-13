'use strict';

const { E_SCHEMA } = require('./constants');

exports.objectPath = objectPath;
exports.arrayPath = arrayPath;
exports.raw = raw;
exports.unwrap = unwrap;
exports.assertType = assertType;
exports.assertValidator = assertValidator;
exports.lazy = lazy;
exports.typeOf = typeOf;
exports.stringify = stringify;
exports.copyTypeAndProperties = copyTypeAndProperties;
exports.copyPropertyDescriptor = copyPropertyDescriptor;

exports.failSchemaValidation = failSchemaValidation;
exports.failType = failType;
exports.failSet = failSet;
exports.failDelete = failDelete;
exports.failNotSchemaObject = failNotSchemaObject;

/**
 * @typedef {import('./verifyer').SchemaValue} SchemaValue
 * @typedef {import('./object').ObjectValidator<*>} ObjectValidator
 */
/**
 * @typedef {import('./validator').Validator<*>} Validator
 */

/**
 * @param {string | null | undefined} base
 * @param {string | symbol} key
 * @returns {string}
 */
function objectPath(base, key) {
  return base ? `${base}.${String(key)}` : String(key);
}

/**
 * @param {string | null | undefined} base
 * @param {number | string} index
 * @returns {string}
 */
function arrayPath(base, index) {
  return `${base || ''}[${index}]`;
}

/**
 * @param {Object} value
 * @returns {string}
 */
function raw(value) {
  const { toJSON } = value;
  if (!toJSON) {
    failNotSchemaObject();
  }
  return toJSON.call(value);
}

/**
 * @param {Object} value
 * @returns {Object}
 */
function unwrap(value) {
  if (!value) {
    return value;
  }
  const { toJSON } = value;
  if (toJSON) {
    return toJSON.call(value);
  }
  switch (typeOf(value)) {
    case 'Object':
      return unwrapCopy(value, {});
    case 'Array':
      return unwrapCopy(value, []);
    default:
      return value;
  }
}

/**
 * @param {Object} value
 * @param {Object} clone
 * @returns {Object}
 */
function unwrapCopy(value, clone) {
  let did_unwrap = false;
  for (const [k, v] of Object.entries(value)) {
    const u = unwrap(v);
    clone[k] = u;
    if (u !== v) {
      did_unwrap = true;
    }
  }
  return did_unwrap ? clone : value;
}

/**
 * @param {Object} value
 * @param {string} type
 * @param {string | null} [base]
 * @param {string} [error_code]
 */
function assertType(value, type, base, error_code) {
  if (typeOf(value) !== type) {
    failType(type, value, base, error_code);
  }
}

/**
 * @template {Validator} V
 * @param {V} test
 */
function assertValidator(test) {
  if (typeOf(test) !== 'Function') {
    throw new TypeError(`Invalid validator ${stringify(test)}`);
  }
}

/**
 * @param {Object} object
 * @param {string} property
 * @param {() => Object} factory
 */
function lazy(object, property, factory) {
  let cache;
  Object.defineProperty(object, property, {
    configurable: true,
    get: () => cache || (cache = factory())
  });
}

/**
 * @param {Object} value
 * @returns {string}
 */
function typeOf(value) {
  const str = Object.prototype.toString.call(value);
  return str.substring(8, str.length - 1);
}

/** @type {Record<string, (Object) => string>} */
const serialize = {
  Function: () => 'function',
  Number: String, // NaN and Infinity
  RegExp: String,
  Arguments: String
};

/**
 * @param {Object} value
 * @returns {string}
 */
function stringify(value) {
  return (serialize[typeOf(value)] || JSON.stringify)(value);
}

/**
 * @param {Object} from
 * @param {string} name
 * @param {Object} to
 */
function copyPropertyDescriptor(from, name, to) {
  const desc = Object.getOwnPropertyDescriptor(from, name);
  if (desc) {
    Object.defineProperty(to, name, desc);
  }
}

/**
 * @param {Object} from
 * @param {Object} to
 */
function copyTypeAndProperties(from, to) {
  if (!('type' in from)) {
    return;
  }
  to.type = from.type;
  switch (from.type) {
    case 'Object':
      to.properties = from.properties;
      break;
    case 'Array':
      to.items = from.items;
      break;
    case 'Map':
      to.keys = from.keys;
      to.values = from.values;
      break;
    default:
    // Do nothing
  }
}

/**
 * @param {Error} error
 * @param {string} [error_code]
 */
function failSchemaValidation(error, error_code = E_SCHEMA) {
  throw Object.defineProperty(error, 'code', { value: error_code });
}

/**
 * @param {Object} expected
 * @param {Object} value
 * @param {string | null} [property]
 * @param {string} [error_code]
 */
function failType(expected, value, property, error_code) {
  if (property && value === undefined) {
    failSchemaValidation(
      new TypeError(`Missing property "${property}"`),
      error_code
    );
  }
  const expectation = `${expected} but got ${stringify(value)}`;
  failSchemaValidation(
    new TypeError(
      property
        ? `Expected property "${property}" to be ${expectation}`
        : `Expected ${expectation}`
    ),
    error_code
  );
}

/**
 * @returns {false}
 */
function failSet() {
  failSchemaValidation(new Error('Invalid assignment on read-only object'));
  return false;
}

/**
 * @returns {false}
 */
function failDelete() {
  failSchemaValidation(new Error('Invalid delete on read-only object'));
  return false;
}

/**
 */
function failNotSchemaObject() {
  throw new TypeError('Argument is not a schema reader or writer');
}
