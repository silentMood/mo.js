var _ = require('../utils');
var event = require('../core_mixins/event');
var directives = require('../directives/index');

function Directive(opts) {
	assert(opts.expression !== null);
	assert(opts.scene !== null);

	//events container
	this.events = {};

	//directive name
	this.dirName = opts.dirName;
	//directive el
	this.el = opts.el;
	//directive expression
	this.expression = opts.expression;

	//get the link fn and unlink fn
	var dir = directives[this.dirName];
	if(!dir) {
		console.log('can not recognise ' + this.dirName + 'directive');
		this.bind = function(){};
		this.unbind = function(){};
	}
	else {
		assert(dir.bind !== null);
		assert(dir.unbind !== null);

		_.mixin(this, dir);
	}
}

Directive.prototype = _.extend(event, {});

module.exports = Directive;