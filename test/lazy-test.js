/*eslint-env mocha*/
'use strict';

const { assert, sinon } = require('@sinonjs/referee-sinon');
const { lazy } = require('../lib/lazy');

describe('lazy', () => {
  it('invokes given factory once', () => {
    const factory = sinon.fake(() => ({ some: 'object' }));
    const object = {};

    lazy(object, 'test', factory);

    const result_1 = object.test;
    const result_2 = object.test;

    assert.calledOnce(factory);
    assert.same(result_1, result_2);
  });
});
