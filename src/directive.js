var _ = require('./utils');
var config = require('./config');
var event = require('./event');
var directives = require('./directives/index');

function linkDirective(expression) {
	var Dir = directives[this.dirName];
	if(Dir) {
		Dir.bind(this)(expression);
	}
	else {
		var err = new Error('can not recognise ' + this.dirName + ' directive');
		throw err;
	}
}

function Directive(opts) {
	assert(opts.expression !== null);
	assert(opts.scene !== null);
	assert(opts.el !== null);

	var self = this;
	self.events = {};

	self.dirName = opts.dirName;
	self.el = opts.el;
	self.expression = opts.expression;
	self.childs = [];
	self.parent = opts.scene;
	self.parent.childs.push(self);

	linkDirective.bind(this)(self.expression);
}

Directive.prototype = _.extend(event, {});

module.exports = Directive;