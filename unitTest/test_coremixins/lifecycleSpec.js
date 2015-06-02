//all references
var chai = require("chai");
var sinon = require("sinon");
var should = require('should');
var sinonChai = require("sinon-chai");
chai.should();
chai.use(sinonChai);

//test module
var lifecycle = require('../../src/core_mixins/lifecycle');

describe('life cycle', function(){
	var target = lifecycle;

	beforeEach(function() {
		target.$emit = sinon.spy(function(eventName, next) {
			if(next) next();
		});
	});

  it('test enter $pushStatus', function(){
  	target.$pushStatus();

  	target._status.should.be.eql(3);
  	target.$emit.should.have.been.calledWith('hook:prepare');
  	target.$emit.should.have.been.calledWith('hook:ready');
  	target.$emit.should.have.been.calledWith('hook:go');
  	target.$emit.should.have.been.calledThrice;
  });

  it('test left $pushStatus', function(){
  	target.$pushStatus();
  	target._status.should.be.eql(0);

  	target.$emit.should.have.been.calledWith('hook:hold');
  	target.$emit.should.have.been.calledWith('hook:left');
  	target.$emit.should.have.been.calledWith('hook:goto');
  	target.$emit.should.have.been.calledThrice;
  });

});