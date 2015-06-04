var Directive = require('../../../src/core/directive');
var config = require('../../../src/config');
var mockDom = require('../mock/mock_dom');

describe('compiler', function(){
	var container;
	var dir;

	beforeEach(function(){
		container = document.createElement('div');
    container.innerHTML = "<div d-go='scene2'></div>";
    document.body.appendChild(container);

    dir = new Directive({
    	dirName: 'go',
			expression: 'scene2',
			scene: {},
			el: container
    });
    //do some mock
    container.addEventListener = jasmine.createSpy('add');
    container.removeEventListener = jasmine.createSpy('remove');
	});

	afterEach(function() {
		container.remove();
	});

	it('when call the bind func, then the addEventListener should be called', function() {		
		dir.bind();
		expect(container.addEventListener).toHaveBeenCalledWith('click', dir.handleClick);
	});

	it('when call the unbind func, then the removeEventListener should be called', function() {
		dir.unbind();
		expect(container.removeEventListener).toHaveBeenCalledWith('click', dir.handleClick);
	});
});