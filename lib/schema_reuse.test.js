'use strict';

const { assert, refute } = require('@sinonjs/referee-sinon');
const { schema, opt, string } = require('../');

describe('schema reuse', () => {
  it('allows to reuse tests in specs', () => {
    const child = opt({
      name: string
    });

    const person = schema(child);
    const parent = schema({ child });

    refute.exception(() => {
      person({ name: 'test' });
      parent({});
      parent({ child: { name: 'test' } });
    });
    assert.exception(
      () => {
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
