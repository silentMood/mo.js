_ = require('./utils');
event = require('./event');

function Scene() {
	self = this;

	self.dirs = [];
	self.events = {};

	self.states = {
		enterfinish: false,
		leftfinish: false
	};

	self.$on('EndRegisterDirectives', function() {
		self.$emit('TriggerAllElementsEnterTransition');
	});

	self.$on('AllElementsEnterTransitionEnd', function() {
		self.states.enterfinish = true;
	});

	self.$on('AllElementsLeftTransitionEnd', function() {
		self.states.leftfinish = true;
	});
}

Scene.prototype = _.extend(event, {});

module.exports = Scene;