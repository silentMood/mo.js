_ = require('./utils');
event = require('./event');

var baseId = 0;
function generateSceneId() {
	return baseId++;
}

function Scene(opts) {
	var self = this;
	self.id = opts.sceneId ? opts.sceneId : generateSceneId();
	self.el = opts.el;
	self.events = {};

	self.childs = self.dirs = [];
	self.parent = opts.root;
	self.parent.childs.push(self);

	self.states = {
		canLeft: false
	};

	self.$on('EndRegisterDirectives', function() {
		self.$broadcast('TriggerAllElementsEnterTransition');
	});

	self.$on('AllElementsEnterTransitionEnd', function() {
		self.states.canLeft = true;
	});
}

Scene.prototype = _.extend(event, {});

module.exports = Scene;