# Studio Schema

Plain JavaScript objects that throw if invalid or unknown properties are read,
assigned or deleted. For node and browsers with [Proxy][1] support.

## Usage

Defining a schema:

```js
const spec = require('@studio/schema');

const personSchema = spec({
  name: 'string',
  age: spec.opt('integer')
});
```

### Schema Validation:

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

### Readers:

A reader validates a given data structure and returns a `Proxy` that makes the
data read-only and verifies that only defined properties are accessed.

```js
const person = personSchema.read({ name: 'Test', age: 7 });

const name = person.name; // ok
const age = person.age; // ok
const customer = person.customer; // throws
person.name = 'Changed'; // throws
```

### Writers:

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

## API

This module exports the `spec` function exposing the API, so you can require it
in two ways:

```js
const spec = require('@studio/schema');
```

With [destructuring][2]:

```js
const { spec, opt, array, one } = require('@studio/schema');
```

- `schema = spec(spec)`: Defines a specification. `spec` must be an object
  defining a data structure, or a validator. See below for possible `spec`
  values.
- `validator = all(spec1, spec2, ...)`: Defines a specification where all of
  the given specifications have to match.
- `validator = one(spec1, spec2, ...)`: Defines a specification where one of
  the given specifications has to match.
- `validator = opt(spec[, default])`: Defines an optional specification. If the
  value is not defined, `default` is returned as the value. It is invalid to
  initialize or assign `undefined` to an optional value.
- `validator = object(spec)`: Defines an object. Can be used to declare
  reusable object validators.
- `validator = array(spec)`: Defines an array. Each element in the array has to
  match the given `spec`.
- `validator = keyValue(key_spec, value_spec)`: Defines an object specification
  for key-value pairs where `key_spec` and `value_spec` are the specifications
  for the object key and value pairs.

Note that `all`, `one` and `opt`, `object`, `array` and `keyValue` are also
exposed on `spec`.

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
  the writer with `JSON.stringify` or `schema.verify(writer)` it will throw if
  non-optional values are missing.
- `data = schema.verify(writer)`: Checks if any properties are missing in the
  given writer and returns the unwrapped data.

## License

MIT

[1]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
[2]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
