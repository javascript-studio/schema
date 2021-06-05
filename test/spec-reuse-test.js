/*eslint-env mocha*/
'use strict';

const { assert, refute } = require('@sinonjs/referee-sinon');
const { schema, opt } = require('../');

describe('spec reuse', () => {
  it('allows to reuse tests in specs', () => {
    const child = opt({
      name: 'string'
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
        message: 'Expected opt({name:string}) but got {"name":1}',
        code: 'SCHEMA_VALIDATION'
      }
    );
    assert.exception(
      () => {
        parent({ child: { name: 1 } });
      },
      {
        name: 'TypeError',
        message:
          'Expected property "child" to be opt({name:string}) but got ' +
          '{"name":1}',
        code: 'SCHEMA_VALIDATION'
      }
    );
  });
});
