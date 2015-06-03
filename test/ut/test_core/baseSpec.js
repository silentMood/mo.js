var X = require('../../../src/core/x');
var mockDom = require('../mock/mock_dom');
var compiler = require('../../../src/compiler/compile');

describe('base', function(){
	var x;
	var fn;
	var container;

	beforeAll(function(){
		container = document.createElement('div');
    container.innerHTML = mockDom;
    document.body.appendChild(container);

		x = new X({elId: 'app'});
	});

	beforeEach(function() {
		fn = jasmine.createSpy('spy');
		x.$on('test', fn);
		x.childs.forEach(function(child) {
			child.$on('test', fn);
			child.childs.forEach(function(child) {
				child.$on('test', fn);
			});
		});
	});

	afterEach(function() {
		x.$off('test');
		x.childs.forEach(function(child) {
			child.$off('test');
			child.childs.forEach(function(child) {
				child.$off('test');
			});
		});
	});

	afterAll(function() {
		container.remove();
	});

	it('when directive dispatch, the fn should be called 3 times', function() {
		x.childs[0].childs[0].$dispatch('test');
		expect(fn.calls.count()).toEqual(2);
	});

	it('when x broadcast, the fn should be called 3 times', function() {
		x.$broadcast('test');
		expect(fn.calls.count()).toEqual(15);
	});
});