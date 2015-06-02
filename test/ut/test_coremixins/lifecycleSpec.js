//test module
var lifecycle = require('../../../src/core_mixins/lifecycle');

describe('life cycle', function(){
	var target = lifecycle;
  var fn;

	beforeEach(function() {
    times = 0;
    fn = jasmine.createSpy('fn');
		target.$emit = function(eventName, next) {
      fn(eventName);
			if(next) {
        next();
      }
		};
	});

  it('test enter $pushStatus', function(){
  	target.$pushStatus();

  	expect(target._status).toBe(3);
    expect(fn).toHaveBeenCalledWith('hook:prepare');
    expect(fn).toHaveBeenCalledWith('hook:ready');
    expect(fn).toHaveBeenCalledWith('hook:go');
    expect(fn.calls.count()).toEqual(3);
  });

  it('test left $pushStatus', function(){
  	target.$pushStatus();

    expect(target._status).toBe(0);
    expect(fn).toHaveBeenCalledWith('hook:hold');
    expect(fn).toHaveBeenCalledWith('hook:left');
    expect(fn).toHaveBeenCalledWith('hook:goto');
    expect(fn.calls.count()).toEqual(3);
  });

});