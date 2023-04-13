'use strict';

const { assert, refute } = require('@sinonjs/referee-sinon');
const { schema, opt, string, object } = require('../');

describe('schema reuse', () => {
  it('allows to reuse tests in validator', () => {
    const child = opt(
      object({
        name: string
      })
    );

    const person = schema(child);
    const parent = schema(object({ child }));

    refute.exception(() => {
      person({ name: 'test' });
      parent({});
      parent({ child: { name: 'test' } });
    });
    assert.exception(
      () => {
        // @ts-expect-error
        person({ name: 1 });
      },
      {
        name: 'TypeError',
        message: 'Expected property "name" to be string but got 1',
        code: 'E_SCHEMA'
      }
    );
    assert.exception(
      () => {
        // @ts-expect-error
        parent({ child: { name: 1 } });
      },
      {
        name: 'TypeError',
        message: 'Expected property "child.name" to be string but got 1',
        code: 'E_SCHEMA'
      }
    );
  });
});
