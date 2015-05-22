var assert = require('./assert');
var _ = require('./utils');
var event = require('./event');
var compiler = require('./compile');

function X(opts) {
	var el = null;
	if(opts && opts.elId) {
		el = document.querySelector('#' + opts.elId);
	}
	else {
		el = document.body;
	}

	this.el = el;
	this.scenes = [];
	compiler.$compile(this.el, this);
}

X.prototype = _.extend(event, {
	$redirect: function(sceneId) {
		this.$emit("TriggerAllElementsLeftTransition");
	},
});

module.exports = X;