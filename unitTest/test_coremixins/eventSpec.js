//all references
var chai = require("chai");
var sinon = require("sinon");
var should = require('should');
var sinonChai = require("sinon-chai");
chai.should();
chai.use(sinonChai);

//test module
var event = require('../../src/core_mixins/event');

describe('event', function(){
	var fn;
	var target = event;

	beforeEach(function() {
		fn = sinon.spy(function(){});
		target.$off("test");
	});

  it('test $on', function(){
  	target.$on("test", fn);
    (target.events !== null).should.be.true;
    target.events['test'].length.should.be.eql(1);
  });

  it('test $emit', function() {
  	target.$on("test", fn);
  	target.$emit('test');
  	fn.should.have.been.calledOnce;
  	target.$emit('test');
  	fn.should.have.been.calledTwice;
  });

  it('test $off', function() {
  	var fnt = function(){};
  	target.$on('test', fnt);
  	target.$on('test', fn);
  	target.$off('test', fn);
  	target.events['test'].length.should.eql(1);
  	target.$off('test', fn);
  	target.events['test'].length.should.eql(1);
  	target.$off('test', fnt);
  	(target.events['test'] === null).should.be.true;
  });

  it('test $once', function() {
  	target.$once('test', fn);
  	target.$emit('test', fn);
  	target.$emit('test', fn);
  	fn.should.have.been.calledOnce;
  	(target.events['test'] === null).should.be.true;
  });
});