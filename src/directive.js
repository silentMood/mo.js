var _ = require('./utils');
var config = require('./config');
var event = require('./event');
var directives = require('./directives/index');

function linkDirective(expression) {
	Dir = directives[this.dirName];
	if(Dir) {
		Dir.bind(this)(expression);
	}
	else {
		var err = new Error('can not recognise' + this.dirName + 'directive');
		throw err;
	}
}

function Directive(opts) {
	assert(opts.expression !== null);
	assert(opts.scene !== null);
	assert(opts.el !== null);

	self = this;

	self.dirName = opts.dirName;
	self.el = opts.el;
	self.parent = opts.scene;
	self.expression = opts.expression;

	linkDirective.bind(this)(self.expression);
}

Directive.prototype = _.extend(event, {});

module.exports = Directive;