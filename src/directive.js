var _ = require('./utils');
var config = require('./config');
var event = require('./event');
var directives = require('./directives/index');

function linkDirective(expression) {
	Dir = directives[dirname];
	if(Dir) {
		Dir(expression);
	}
	else {
		var err = new Error('can not recognise' + dirname + 'directive');
		throw err;
	}
}

function Directive(opts) {
	assert(opts.expression !== null);
	assert(opts.scene !== null);
	assert(opts.el !== null);

	self = this;

	self.scene = opts.scene;
	self.el = opts.el;

	linkDirective.bind(this)(expression);
}

Directive.prototype = _.extend(events, {
	$dispatch: function(eventName) {


	}
});

module.exports = Directive;