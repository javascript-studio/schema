/*eslint-env mocha*/
'use strict';

const { assert, refute } = require('@sinonjs/referee-sinon');
const { spec, opt } = require('../');

describe('spec reuse', () => {

  it('allows to reuse tests in specs', () => {
    const child = opt({
      name: 'string'
    });

    const person = spec(child);
    const parent = spec({ child });

    refute.exception(() => {
      person({ name: 'test' });
      parent({});
      parent({ child: { name: 'test' } });
    });
    assert.exception(() => {
      person({ name: 1 });
    }, /TypeError: Expected opt\({name:string}\) but got {"name":1}/);
    assert.exception(() => {
      parent({ child: { name: 1 } });
    // eslint-disable-next-line max-len
    }, /TypeError: Expected property "child" to be opt\({name:string}\) but got {"name":1}/);
  });

});
