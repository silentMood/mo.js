var X = require('../../../src/core/x');
var mockDom = require('../mock/mock_dom');
var router = require('../../../src/router');

describe('X', function(){
	var x;
  var config;
  var route;
  var container;

  beforeAll(function(){
    container = document.createElement('div');
    container.innerHTML = mockDom;
    document.body.appendChild(container);

    config = router.$config;
    router.$config = jasmine.createSpy('config');

    route = router.$route;
    router.$route = jasmine.createSpy('route');

    x = new X({elId: "app"});
  });

  afterAll(function() {
    container.remove();
    router.$config = config;
    router.$route = route;
  });

  it('new X', function(){
  	expect(Object.keys(x.childs).length).toBe(2);
    expect(router.$config).toHaveBeenCalled();
    expect(router.$route).toHaveBeenCalled();
  });

  it('isSceneIdExist', function() {
    expect(x.$isSceneIdAlreadyExist('scene1')).toBe(true);
  });

  it('get sceneById', function() {
    var scene = x.$getSceneBySceneId('scene1');
    expect(scene !== null).toBe(true);
  });
});