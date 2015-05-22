_ = require('./utils');
event = require('./event');

baseId = 0;
function generateSceneId() {
	return baseId++;
}

function Scene(opts) {
	self = this;
	self.id = opts.sceneId ? opts.sceneId : generateSceneId();
	self.parent = opts.root;
	self.el = opts.el;

	self.childs = [];
	self.next = null;

	self.states = {
		canLeft: false
	};

	self.$emit('TriggerAllElementsEnterTransition');

	self.$on('AllElementsEnterTransitionEnd', function() {
		self.states.canLeft = true;
	});

	self.$on('AllElementsLeftTransitionEnd', function() {
		router.navigate(self.next);
	});
}

Scene.prototype = _.extend(event, {
	$goto: function(sceneId) {
		this.next = sceneId;
		this.$emit("TriggerAllElementsLeftTransition");
	},
});

module.exports = Scene;