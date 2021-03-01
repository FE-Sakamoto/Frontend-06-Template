const assert = require('assert')

import {add, mul} from '../src/index'

describe('add function testing', () => {
  it('1+2 shoule be 3', function(){
    assert.equal(add(1, 2), 3)
  })
  it('-5+2 shoule be 3', function(){
    assert.equal(add(-5, 2), -3)
  })

  it('-5*2 shoule be -10', function(){
    assert.equal(mul(-5, 2), -10)
  })
});

