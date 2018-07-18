# Studio Schema

Define your data structures and work with plain JavaScript objects that throw
if wrong values or unknown properties are read or assigned.

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

- `schema = spec(spec)`: Defines a specification. See below for possible `spec`
  values.
- `schema = all(spec1, spec2, ...)`: Defines a specification where all of the
  given specifications have to match.
- `schema = one(spec1, spec2, ...)`: Defines a specification where one of the
  given specifications has to match.
- `schema = opt(spec[, default])`: Defines an optional specification. If the
  value is not defined, `default` is returned as the value.

Note that the `all`, `one` and `opt` methods are also exposed on `spec`.

## Spec

The kind of specification being built depends on the type of the `spec`
argument:

- `boolean`: Defines whether the property must be present:
    - `true`: The property must be present.
    - `false`: The property is optional.
- `string`: Defines a built-in type. These types are defined:
    - `"null"`: Requires a null value.
    - `"boolean"`: Requires a boolean primitive.
    - `"number"`: Requires a number primitive.
    - `"integer"`: Requires a number primitive that has no fractions.
    - `"string"`: Requires a string primitive.
    - `"object"`: Requires an object.
    - `"function"`: Requires a function.
    - `"regexp"`: Requires a RegExp object.
    - `"date"`: Requires a Date object.
- `regexp`: Requires the stringified value to match the regular expression.
  Create a spec that strictly matches only strings like this: `all('string',
  /[a-z]+/)`.
- `function`: Defines a custom specification. The function receives a value
  and may throw if the value is not considered valid.
- `object`: Defines a nested object specification.
- `array`: Defines a nested array specification. The array must have exactly
  one element with the specification for the array elements.

## Schema API

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
