var X = require('../../../src/core/x');
var mockDom = require('../mock/mock_dom');

describe('X', function(){
	var x;

  beforeAll(function(){
    var container = document.createElement('div');
    container.innerHTML = mockDom;
    document.body.appendChild(container);
  });

  it('new X without a elId', function(){
  	x = new X;
  	expect(Object.keys(x.childs).length).toBe(0);
  });

  it('new X with a elId which does not exist', function(){
  	x = new X({elId: "test"});
  	expect(Object.keys(x.childs).length).toBe(0);
  });

  it('new X with a exist elId', function(){
  	x = new X({elId: "app"});
  	expect(Object.keys(x.childs).length).toBe(2);
  });
});