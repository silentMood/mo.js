var X = require('../../../src/core/x');

describe('X', function(){
	var x;

  it('new X without a elId', function(){
  	x = new X;
  	expect(Object.keys(x.childs).length).toBe(0);
  });

  it('new X with a elId which does not exist', function(){
  	x = new X({elId: "test"});
  	expect(Object.keys(x.childs).length).toBe(0);
  });
});