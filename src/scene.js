_ = require('./utils');
event = require('./event');

function Scene() {
	self = this;

	self.dirs = [];
	self.events = {};

	self.$on('EndRegisterDirectives', function() {
		self.$emit('TriggerAllElementsEnterTransition');
	});
}

Scene.prototype = _.extend(event, {});

module.exports = Scene;