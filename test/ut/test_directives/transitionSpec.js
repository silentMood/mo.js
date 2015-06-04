var Directive = require('../../../src/core/directive');
var config = require('../../../src/config');
var mockDom = require('../mock/mock_dom');
var event = require('../../../src/core_mixins/event');

describe('directive transition part', function(){

	describe('directive animationcontroller', function() {
		var container;
		var scene;
		var dir;

		beforeEach(function(){
			container = document.createElement('div');
	    container.innerHTML = "<div d-animationcontroller='fade'></div>";
	    document.body.appendChild(container);

	    scene = {
	    	$on: jasmine.createSpy('on'),
	    	$off: jasmine.createSpy('off')
	    };
	    dir = new Directive({
	    	dirName: 'animationcontroller',
				expression: 'fade',
				scene: scene,
				el: container
	    });
	    dir.parent = scene;
		});

		afterEach(function() {
			container.remove();
		});

		it('when call the bind func, then the directive will hook the lifecycle events: hook:readyForDirBehavior, hook:holdForDirBehavior', function() {		
			dir.bind();
			expect(scene.$on).toHaveBeenCalledWith('hook:readyForDirBehavior', jasmine.any(Function));
			expect(scene.$on).toHaveBeenCalledWith('hook:holdForDirBehavior', jasmine.any(Function));
		});

		it('when call the unbind func, then the hooks which are the lifecycle events will be off', function() {
			dir.unbind();
			expect(scene.$off).toHaveBeenCalledWith('hook:readyForDirBehavior');
			expect(scene.$off).toHaveBeenCalledWith('hook:holdForDirBehavior');
		});
	});

	describe('directive EnterAnimation', function() {
		var container;
		var scene;
		var dir;

		beforeEach(function(){
			container = document.createElement('div');
	    container.innerHTML = "<div d-enteranimation='1/fade'></div>";
	    document.body.appendChild(container);

	    scene = {
	    	$on: jasmine.createSpy('on'),
	    	$off: jasmine.createSpy('off')
	    };
	    dir = new Directive({
	    	dirName: 'enteranimation',
				expression: '1/fade',
				scene: scene,
				el: container
	    });
	    dir.parent = scene;
		});

		afterEach(function() {
			container.remove();
		});

		it('when call the bind func, then the directive will register event', function() {		
			dir.bind();
			expect(dir.$detail().enter['1'][0].transEffect).toBe('fade');
		});

		it('when call the unbind func, then the directive will unregister event', function() {
			dir.unbind();
			expect(dir.$detail().enter['1'] === undefined).toBe(true);
		});
	});

	describe('directive LeftAnimation', function() {
		var container;
		var scene;
		var dir;

		beforeEach(function(){
			container = document.createElement('div');
	    container.innerHTML = "<div d-leftanimation='1/fade'></div>";
	    document.body.appendChild(container);

	    scene = {
	    	$on: jasmine.createSpy('on'),
	    	$off: jasmine.createSpy('off')
	    };
	    dir = new Directive({
	    	dirName: 'leftanimation',
				expression: '1/fade',
				scene: scene,
				el: container
	    });
	    dir.parent = scene;
		});

		afterEach(function() {
			container.remove();
		});

		it('when call the bind func, then the directive will register event', function() {		
			dir.bind();
			expect(dir.$detail().left['1'][0].transEffect).toBe('fade');
		});

		it('when call the unbind func, then the directive will unregister event', function() {
			dir.unbind();
			expect(dir.$detail().left['1'] === undefined).toBe(true);
		});
	});
});