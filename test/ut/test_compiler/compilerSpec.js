var Scene = require('../../../src/core/scene');
var mockDom = require('../mock/mock_dom');
var compiler = require('../../../src/compiler/compile');
var config = require('../../../src/config');

describe('compiler', function(){
	var container;
	var scene;

	beforeEach(function(){
		container = document.createElement('div');
    container.innerHTML = mockDom;
    document.body.appendChild(container);

    var root = {el: container.querySelector('#app')};
    scene = new Scene({
			tpl: container.querySelector('script[scene=scene2]'), 
			root: root, 
			sceneId: 'scene2'});
    scene.parent = root;
	});

	afterEach(function() {
		container.remove();
	});

	//test the sub-items number
	it('when compile the scene, the scene should have 13 sub-items', function() {
		scene.$insertEl();
		compiler.$compile(scene);

		//13 related to mockDom
		expect(scene.childs.length).toEqual(13);
		expect(scene.fns.length).toEqual(13);
		expect(scene.ufns.length).toEqual(13);
	});

	//the framework-related attr has been removed
	it('when compile the scene, the scene should framework-related attr should have been removed', function() {
		scene.$insertEl();

		expect(scene.el.innerHTML.indexOf(config.prefix)).toBeGreaterThan(0);
		
		compiler.$compile(scene);

		expect(scene.el.innerHTML.indexOf(config.prefix)).toBe(-1);
	});
});