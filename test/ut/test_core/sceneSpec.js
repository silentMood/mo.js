var Scene = require('../../../src/core/scene');
var mockDom = require('../mock/mock_dom');
var compiler = require('../../../src/compiler/compile');

describe('scene', function(){
	var scene;
	var compile;
	var container;

	beforeAll(function(){
		container = document.createElement('div');
    container.innerHTML = mockDom;
    document.body.appendChild(container);

		scene = new Scene({
			tpl: container.querySelector('script[scene=scene2]'), 
			root: {el: container.querySelector('#app')}, 
			sceneId: 'scene2'});
		//do some mock
		scene.$insertEl = jasmine.createSpy('spy');
		scene.$link = jasmine.createSpy('spy');
		scene.$unlink = jasmine.createSpy('spy');
		scene.$removeEl = jasmine.createSpy('spy');

		compile = compiler.$compile;
		compiler.$compile = jasmine.createSpy('spy');
	});

	afterAll(function() {
		container.remove();
		//revert the mock
		compiler.$compile = compile;
	});

	it('when enter, these behavior should happen', function() {
		scene.$pushStatus();
		expect(scene.$insertEl).toHaveBeenCalled();
		expect(compiler.$compile).toHaveBeenCalled();
		expect(scene.$link).toHaveBeenCalled();
	});

	it('when left, these behavior should happen', function() {
		scene.$pushStatus();
		expect(scene.$unlink).toHaveBeenCalled();
		expect(scene.$removeEl).toHaveBeenCalled();
	});
});