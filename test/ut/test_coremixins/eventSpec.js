//test module
var event = require('../../../src/core_mixins/event');

describe('event', function(){
	var fn;
	var target = event;

	beforeEach(function() {
		fn = jasmine.createSpy('spy');
		target.$off("test");
	});

  it('test $on', function(){
  	target.$on("test", fn);
    expect(target.events !== null).toBe(true);
    expect(target.events['test'].length).toBe(1);
  });

  it('test $emit', function() {
  	target.$on("test", fn);
  	target.$emit('test');
    expect(fn.calls.count()).toEqual(1);
  	target.$emit('test');
    expect(fn.calls.count()).toEqual(2);
  });

  it('test $off', function() {
  	var fnt = function(){};
  	target.$on('test', fnt);
  	target.$on('test', fn);
  	target.$off('test', fn);
    expect(target.events['test'].length).toBe(1);
  	target.$off('test', fn);
    expect(target.events['test'].length).toBe(1);
  	target.$off('test', fnt);
  	expect(target.events['test'] === null).toBe(true);
  });

  it('test $once', function() {
  	target.$once('test', fn);
  	target.$emit('test', fn);
  	target.$emit('test', fn);
    expect(fn.calls.count()).toEqual(1);
    expect(target.events['test'] === null).toBe(true);
  });
});