# Studio Schema

Plain JavaScript objects with runtime type guarantees. For node and browsers
with [Proxy][1] support.

## Usage

Defining a schema:

```js
const schema = require('@studio/schema');

const personSchema = schema({
  name: 'string',
  age: spec.opt('integer')
});
```

### Schema Validation

The schema is a function that can be used to validate a given data structure.
It throws if non optional properties are missing, a value has the wrong type,
or undeclared properties are present.

```js
personSchema({ name: 123 }); // throws
personSchema({ name: 'Test', customer: true }); // throws
personSchema({ name: 'Test', age: true }); // throws
personSchema({ name: 'Test', age: 7.5 }); // throws

personSchema({ name: 'Test' }); // ok
personSchema({ name: 'Test', age: 7 }); // ok
```

### Readers

A reader validates a given data structure and returns a `Proxy` that makes the
data read-only and verifies that only defined properties are accessed.

```js
const person = personSchema.read({ name: 'Test', age: 7 });

const name = person.name; // ok
const age = person.age; // ok
const customer = person.customer; // throws
person.name = 'Changed'; // throws
```

### Writers

A writer accepts an empty or partial data structure and returns a `Proxy` that
validates any accessed, assigned or deleted properties. To verify that no non
optional properties are missing, use `schema.verify(writer)` or
`JSON.stringify(proxy)`.

```js
const person = person_schema.write({ name: 'Test' });

person.customer = true; // throws
person.name = 'Changed'; // ok
person.age = 7; // ok
```

### Errors

These schema validation errors are thrown:

- `TypeError: Expected ${name} but got ${actual}`: Thrown when a value does not
  match the expectation.
- `TypeError: Expected property "${property}" to be ${name} but got ${actual}`:
  Thrown when a value does not match the expectation, showing the path to the
  invalid property.
- `ReferenceError: Invalid property "${property}"`: Thrown when an unspecified
  property is accessed, showing the path to the invalid property.
- `Error: Invalid assignment on read-only object`: Thrown when assigning a
  property on a reader.
- `Error: Invalid delete on read-only object`: Thrown when deleting a property
  on a reader.

All schema validation errors have a `code` property with the value
`SCHEMA_VALIDATION`.

## API

This module exports the `schema` function exposing the API, so you can require
it in two ways:

```js
const schema = require('@studio/schema');
```

With [destructuring][2]:

```js
const { schema, opt, one } = require('@studio/schema');
```

- `my_schema = schema(spec)`: Defines a specification. `spec` must be an object
  defining a data structure, or a validator. See below for possible values.
- `validator = literal(value_1, value_2, ...)`: Defines a validator that
  matches against a list of primitive values. Can be used to define constants
  or enumerations.
- `validator = all(spec_1, spec_2, ...)`: Defines a validator where all of
  the given specifications have to match.
- `validator = one(spec_1, spec_2, ...)`: Defines a validator where one of
  the given specifications has to match.
- `validator = opt(spec[, default])`: Defines an optional validator. If the
  value is not defined, `default` is returned as the value. It is invalid to
  initialize or assign `undefined` to an optional value.
- `validator = object(spec)`: Defines an object validator. Can be used to
  declare reusable object validators that can be referenced from multiple
  schemas.
- `validator = array(spec)`: Defines an array. Each element in the array has to
  match the given `spec` Can be used to declare reusable array validators that
  can be referenced from multiple schemas.
- `validator = map(key_spec, value_spec)`: Defines a map specification for
  key-value pairs where `key_spec` and `value_spec` are the specifications for
  the object key and value pairs.
- `SCHEMA_VALIDATION`: The `code` property exposed on schema validation errors.

Note that `all`, `one`, `opt`, `object`, `array` and `map` are also exposed on
`spec`.

## Spec

The kind of specification being built depends on the type of the `spec`
argument:

- `null`: Requires a null value.
- `boolean`: Defines whether the property must be present:
    - `true`: The property must be present.
    - `false`: The property is optional.
- `string`: Defines a built-in type. These types are defined:
    - `"null"`: Same as the `null` spec.
    - `"defined"`: Same as the `true` spec.
    - `"optional"`: Same as the `false` spec.
    - `"boolean"`: Requires a boolean primitive.
    - `"number"`: Requires a number primitive.
    - `"integer"`: Requires a number primitive that has no fractions.
    - `"string"`: Requires a string primitive.
    - `"object"`: Requires an object.
    - `"array"`: Requires an array.
- `regexp`: Requires the value to be a string and match the regular expression.
- `function`: Defines a custom specification. The function is expected to
  return `false` if the value is not considered valid.
- `object`: Defines a nested object specification.
- `array`: Defines a nested array specification.

## Schema API

The schema created by `spec` is a function that validates the given value,
throwing a `TypeError` if invalid or returning the given object if valid. For
`object` and `array` specifications, the schema also allows to create proxy
objects that validate reading from the object and assigning values:

- `reader = smy_chema.read(data)`: Creates a schema compliant reader for the
  given data. If the given data does not match the schema, an exception is
  thrown. The returned reader throws on any property modification or on an
  attempt to read an undefined property.
- `writer = smy_chema.write([data[, emitter]])`: Creates a writer with optional
  initial data and an event emitter. If the given data does not match the
  schema, an exception is thrown. The returned writer throws on undefined
  property modification, if an assigned value is invalid, or on an attempt to
  read an undefined property. When using the writer with `JSON.stringify` or
  `my_schema.verify(writer)` it will throw if non-optional values are missing.
  If `emitter` is specified, these events will be emitted:
    - `set` when a property is assigned a new value
    - `delete` when a property is deleted
    - `push` when `push` is called on an array
    - `pop` when `pop` is called on an array
    - `unshift` when `unshift` is called on an array
    - `shift` when `shift` is called on an array
    - `splice` when `splice` is called on an array
- `data = my_schema.verify(writer)`: Checks if any properties are missing in
  the given writer and returns the unwrapped data. Throws if the given object
  is not a schema writer.
- `data = my_schema.raw(reader_or_writer)`: returns the unwrapped data without
  checking if any properties are missing in the given writer. Throws if the
  given object is not a schema reader or writer.

## License

MIT

[1]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
[2]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
