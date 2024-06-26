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
const { schema, object, string, integer, opt } = require('@studio/schema');

/**
 * @typedef {ReturnType<typeof person>} Person
 */
const person = schema(
  object({
    name: string, // mandatory
    age: opt(integer) // optional
  })
);
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

/**
 * @typedef {import('@studio/schema').Infer<typeof personModel>} PersonModel
 */
const personModel = schema(object({ status, person }));
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
`E_SCHEMA`.

### Types

Validators and schemas creates TypeScript types from the given structure.
Resolve the types like this:

```js
/**
 * @typedef {import('@studio/schema').Infer<typeof mySchema>} MySchema
 */
const mySchema = schema(someValidator);

/**
 * @typedef {import('@studio/schema').Infer<typeof myLiteral>} MyLiteral
 */
const myLiteral = literal('foo', 'bar');
```

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

- `schema(validator[, options])`: Returns a new schema with the given validator.
  `validator` The validator to use for the schema. These options are supported:
  - `error_code`: The `code` property to define on errors. Defaults to
    `E_SCHEMA`.
- `defined`: Is a validator that accepts any value other than `undefined`.
- `boolean`: Is a validator that accepts `true` and `false`.
- `number`: Is a validator that accepts finite number values.
- `number.min(min)`: Is a validator that accepts finite number values >= `min`.
- `number.max(max)`: Is a validator that accepts finite number values <= `max`.
- `number.range(min, max)`: Is a validator that accepts finite number values >=
  `min` and <= `max`.
- `integer`: Is a validator that accepts finite integer values.
- `integer.min(min)`: Is a validator that accepts finite integer values >=
  `min`.
- `integer.max(max)`: Is a validator that accepts finite integer values <=
  `max`.
- `integer.range(min, max)`: Is a validator that accepts finite integer values
  > = `min` and <= `max`.
- `string`: Is a validator that accepts string values.
- `string.regexp(re)`: Is a validator that accepts string values matching the
  given regular expression.
- `string.length.{min,max,range}`: Verifies the string length with an integer
  validator.
- `literal(value_1, value_2, ...)`: Returns a validator that matches against a
  list of primitive values. Can be used to define constants or enumerations.
- `all(validator_1, validator_2, ...)`: Returns a validator where all of the
  given validators have to match.
- `one(validator_1, validator_2, ...)`: Returns a validator where one of the
  given validators has to match.
- `opt(validator)`: Returns an optional validator.
- `object(properties)`: Returns an object validator. The given object maps
  object keys to validators.
- `object.any`: Is a validator that accepts arbitrary object values.
- `array(itemValidator)`: Returns an array. Each element in the array has to
  match the given validator..
- `array.any`: Is a validator that accepts arbitrary array values.
- `map(keyValidator, valueValidator)`: Returns a map validator for key-value
  pairs where `keyValidator` and `valueValidator` are the validators for the
  object key and value pairs.
- `validator(test[, toString])`: Creates a custom validator for the given
  `test` function. The optional `toString` argument can be a function that
  returns a string, or a string defining the validator name used in error
  messages. Defaults to `<custom validator>`.
- `E_SCHEMA`: The `code` property exposed on schema validation errors.

Note that all validator functions are also exposed on `schema`.

## Schema API

The schema created by `schema(validator)` is a function that throws a
`TypeError` if the given value does not match the validator, and returns the
value otherwise. For `object` and `array`, the schema also allows to create
proxy objects that validate reading, assigning and deleting properties:

- `reader = mySchema.read(data[, options])`: Creates a schema compliant reader
  for the given data. If the given data does not match the schema, an exception
  is thrown. The returned reader throws on any property modification or on an
  attempt to read an undefined property. These options are supported:
  - `error_code`: The `code` property to define on errors. Defaults to
    `E_SCHEMA`.
- `writer = mySchema.write([data[, options]])`: Creates a writer with optional
  initial data. If the given data does not match the schema, an exception is
  thrown. The returned writer throws on undefined property modification, if an
  assigned value is invalid, or on an attempt to read an undefined property.
  These options are supported:
  - `error_code`: The `code` property to define on errors. Defaults to
    `E_SCHEMA`.
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
