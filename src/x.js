var assert = require('./assert');
var _ = require('./utils');
var event = require('./event');
var compiler = require('./compile');

function X(opts) {
	var self = this;

	var el = null;
	if(opts && opts.elId) {
		el = document.querySelector('#' + opts.elId);
	}
	else {
		el = document.body;
	}

	attrs = el.attributes;
	for(var i = 0; i < attrs.length; i ++) {
		attr = attrs.item(i);
		if(attr.nodeName.match(/mainScene/i)) {
			self.currentView = attr.value;
		}
	}
	if(!self.currentView) {
		self.currentView = 'scene1';
	}

	self.el = el;
	self.childs = self.scenes = [];

	self.$on('SceneSwitch', function(sceneId) {
		self.el.innerHTML = "";
		self.childs = self.scenes = [];
		var template = document.getElementById(sceneId).innerHTML;
		self.el.innerHTML = template;
		compiler.$compile(self.el, self);
	});

	var template = document.getElementById(self.currentView).innerHTML;
	self.el.innerHTML = template;
	compiler.$compile(self.el, self);
}

X.prototype = _.extend(event, {});

module.exports = X;