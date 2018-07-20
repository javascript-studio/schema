# Studio Schema

Define your data structures and work with plain JavaScript objects that throw
if wrong values or unknown properties are read, assigned or deleted. For node
and browsers with [Proxy][1] support.

## Usage

Defining a schema:

```js
const { spec, opt } = require('@studio/schema');

const person_schema = spec({
  name: 'string',
  age: opt('integer')
});
```

Readers:

```js
const person = person_schema.read({ name: 123 }); // throws
const person = person_schema.read({ name: 'Test', customer: true }); // throws
const person = person_schema.read({ name: 'Test', age: true }); // throws
const person = person_schema.read({ name: 'Test', age: 7.5 }); // throws
const person = person_schema.read({ name: 'Test' }); // ok
const person = person_schema.read({ name: 'Test', age: 7 }); // ok

const name = person.name; // ok
const age = person.age; // ok
const customer = person.customer; // throws
person.name = 'Changed'; // throws
```

Writers:

```js
const person = person_schema.write({ name: 123 }); // throws
const person = person_schema.write({ name: 'Test' }); // ok

person.customer = true; // throws
person.name = 'Changed'; // ok
person.age = 7; // ok
```

## API

This module exports the `spec` function exposing the API, so you can require it
in two ways:

```js
const spec = require('@studio/schema');

// Use spec, spec.all, spec.one and spec.opt
```

With destructuring:

```js
const { spec, all, one, opt } = require('@studio/schema');
```

- `schema = spec(spec)`: Defines a specification. `spec` must be an object, an
  array, or validator. See below for possible `spec` values.
- `validator = all(spec1, spec2, ...)`: Defines a specification where all of
  the given specifications have to match.
- `validator = one(spec1, spec2, ...)`: Defines a specification where one of
  the given specifications has to match.
- `validator = opt(spec[, default])`: Defines an optional specification. If the
  value is not defined, `default` is returned as the value. It is invalid to
  initialize or assign `undefined` to an optional value.
- `validator = keyValue(key_spec, value_spec)`: Defines an object specification
  for key-value pairs where `key_spec` and `value_spec` are the specifications
  for the object key and value pairs.

Note that the `all`, `one` and `opt` methods are also exposed on `spec`.

## Spec

The kind of specification being built depends on the type of the `spec`
argument:

- `null`: Requires a null value.
- `boolean`: Defines whether the property must be present:
    - `true`: The property must be present.
    - `false`: The property is optional.
- `string`: Defines a built-in type. These types are defined:
    - `"null"`: Same as the `null` spec.
    - `"boolean"`: Requires a boolean primitive.
    - `"number"`: Requires a number primitive.
    - `"integer"`: Requires a number primitive that has no fractions.
    - `"string"`: Requires a string primitive.
    - `"object"`: Requires an object.
- `regexp`: Requires the stringified value to match the regular expression.
  Create a spec that strictly matches only strings like this: `all('string',
  /[a-z]+/)`.
- `function`: Defines a custom specification. The function is expected to
  return `false` if the value is not considered valid.
- `object`: Defines a nested object specification.
- `array`: Defines a nested array specification. The array must have exactly
  one element with the specification for the array elements.

## Schema API

The schema created by `spec` is a function that validates the given value,
throwing a `TypeError` if invalid or returning the given object if valid. For
`object` and `array` specifications, the schema also allows to create proxy
objects that validate reading from the object and assigning values:

- `reader = schema.read(data)`: Creates a schema compliant reader for the given
  data. If the given data does not match the schema, an exception is thrown.
  The returned reader throws on any property modification or on an attempt to
  read an undefined property.
- `writer = schema.write([data])`: Creates a writer with optional initial data.
  If the given data does not match the schema, an exception is thrown. The
  returned writer throws on undefined property modification, if an assigned
  value is invalid, or on an attempt to read an undefined property. When using
  the writer with `JSON.stringify` it will throw if non-optional values are
  missing.

## License

MIT

[1]: https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Proxy
