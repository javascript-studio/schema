<h1 align="center">
  Studio Schema
</h1>
<p align="center">
  🧩 Plain JavaScript objects with runtime type guarantees. For node and
  browsers.
</p>
<p align="center">
  <a href="https://github.com/javascript-studio/schema/actions">
    <img src="https://github.com/javascript-studio/schema/workflows/Build/badge.svg" alt="Build Status">
  </a>
  <a href="https://www.npmjs.com/package/@studio/schema">
    <img src="https://img.shields.io/npm/v/@studio/schema.svg" alt="npm Version">
  </a>
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/License-MIT-brightgreen.svg" alt="License">
  </a>
</p>

## Usage

Defining a schema:

```js
const { schema, string, integer, opt } = require('@studio/schema');

const person = schema({
  name: string,
  age: opt(integer)
});
```

### Schema Validation

The schema is a function that can be used to validate a given object. It throws
if non-optional properties are missing, a value has the wrong type, or
undeclared properties are present.

```js
person({ name: 123 }); // throws
person({ name: 'Test', customer: true }); // throws
person({ name: 'Test', age: true }); // throws
person({ name: 'Test', age: 7.5 }); // throws

person({ name: 'Test' }); // ok
person({ name: 'Test', age: 7 }); // ok
```

### Validators

Validators are functions that verify values and objects. A validator function
returns `false` if a value doesn't meet the expectation. Studio Schema comes
with a set of pre-defined validators for primitive types, enums, objects,
arrays and maps. Validators can be nested and reused:

```js
const { schema, literal, string, object, array } = require('@studio/schema');

const status = literal('LOADING', 'LOADED', 'SAVING', 'SAVED');
const person = object({
  first_name: string,
  last_name: string,
  tags: array(string)
});

const personModel = schema({ status, person });
```

### Readers

A reader validates a given object and returns a [Proxy][1] that makes the
object read-only and verifies that only defined properties are accessed.

```js
const person = person.read({ name: 'Test', age: 7 });

const name = person.name; // ok
const age = person.age; // ok
const customer = person.customer; // throws
person.name = 'Changed'; // throws
```

### Writers

A writer accepts an empty or partial object and returns a [Proxy][1] that
validates any accessed, assigned or deleted properties. To verify that no
non-optional properties are missing, use `mySchema.verify(writer)`.

```js
const alice = person.write({ name: 'Alice' });

alice.customer = true; // throws
alice.name = 'Changed'; // ok
alice.age = 7; // ok
```

### Errors

All schema validation errors have a `code` property with the value
`SCHEMA_VALIDATION`.

## API

This module exports the `schema` function which carries the entire API, so you
can require it in two ways:

```js
const schema = require('@studio/schema');

const person = schema({ name: schema.string });
```

With [destructuring][2]:

```js
const { schema, string } = require('@studio/schema');

const person = schema({ name: string });
```

- `schema(spec)`: Returns a new schema with the given specification. `spec` can
  be an object, array, or a validator. See below for possible values.
- `defined`: Is a validator that accepts any value other than `undefined`.
- `boolean`: Is a validator that accepts `true` and `false`.
- `number`: Is a validator that accepts number values.
- `integer`: Is a validator that accepts integer values.
- `string`: Is a validator that accepts string values.
- `object`: Is a validator that accepts object values.
- `array`: Is a validator that accepts array values.
- `literal(value_1, value_2, ...)`: Returns a validator that matches against a
  list of primitive values. Can be used to define constants or enumerations.
- `all(spec_1, spec_2, ...)`: Returns a validator where all of the given
  specifications have to match.
- `one(spec_1, spec_2, ...)`: Returns a validator where one of the given
  specifications has to match.
- `opt(spec[, default])`: Returns an optional validator. If the value is not
  defined, `default` is returned as the value. It is invalid to initialize or
  assign `undefined` to an optional value.
- `object(spec)`: Returns an object validator. Can be used to declare reusable
  object validators that can be referenced from multiple schemas.
- `array(spec)`: Returns an array. Each element in the array has to match the
  given `spec` Can be used to declare reusable array validators that can be
  referenced from multiple schemas.
- `map(key_spec, value_spec)`: Returns a map specification for key-value pairs
  where `key_spec` and `value_spec` are the specifications for the object key
  and value pairs.
- `validator(test[, spec_name])`: Creates a custom validator for the given
  `test` function. The optional `spec_name` defaults to `<custom validator>`.
- `SCHEMA_VALIDATION`: The `code` property exposed on schema validation errors.

Note that all validator functions are also exposed on `schema`.

## Spec

The `spec` arguments in all of the above can be of these types:

- `null`: Requires a null value. This is a shorthand for `literal(null)`.
- `regexp`: Requires the value to be a string and match the regular expression.
- `object`: Defines a (nested) object specification.
- `array`: Defines a (nested) array specification.
- `function`: Either an existing validator, or defines a custom validator. The
  function must return `false` if the value is considered invalid.

## Schema API

The schema created by `schema(spec)` is a function that throws a `TypeError` if
the given value does not match, and returns the value otherwise. For `object`
and `array`, the schema also allows to create proxy objects that validate
reading, assigning and deleting properties:

- `reader = mySchema.read(data)`: Creates a schema compliant reader for the
  given data. If the given data does not match the schema, an exception is
  thrown. The returned reader throws on any property modification or on an
  attempt to read an undefined property.
- `writer = mySchema.write([data[, emitter]])`: Creates a writer with optional
  initial data and an event emitter. If the given data does not match the
  schema, an exception is thrown. The returned writer throws on undefined
  property modification, if an assigned value is invalid, or on an attempt to
  read an undefined property. If `emitter` is specified, these events will be
  emitted:
  - `set` when a property is assigned a new value
  - `delete` when a property is deleted
  - `push` when `push` is called on an array
  - `pop` when `pop` is called on an array
  - `unshift` when `unshift` is called on an array
  - `shift` when `shift` is called on an array
  - `splice` when `splice` is called on an array
- `data = mySchema.verify(writer)`: Checks if any properties are missing in the
  given writer and returns the unwrapped data. Throws if the given object is
  not a schema writer.
- `data = reader_or_writer.toJSON()`: returns the original object.

Note that schema readers and writers can be safely used with `JSON.stringify`.

## License

MIT

<p align="center">Made with ❤️ on 🌍<p>

[1]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
[2]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
