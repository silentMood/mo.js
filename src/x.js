var assert = require('./assert');
var _ = require('./utils');
var event = require('./event');
var compiler = require('./compile');

function X(opts) {
	var self = this;
	//events
	self.events = {};
	//create app data structure
	self.childs = self.scenes = {};

	//set total container
	if(opts && opts.elId) {
		self.container = document.querySelector('#' + opts.elId);
	}
	else {
		self.container = document.body;
	}

	//compile all the scenes
	compiler.$compile(self.container, self);

	//set the main interface
	var attrs = self.container.attributes;
	for(var i = 0; i < attrs.length; i ++) {
		attr = attrs.item(i);
		if(attr.nodeName.match(/main/i)) {
			self.currentScene = self.scenes[attr.value];
			break;
		}
	}
	if(!self.currentScene) {
		//error
		return console.log('have not set the main interface yet');
	}

	//start the scene life cycle
	self.$mount();
}

//spread from this
X.prototype = _.extend(event, {
	$mount: function() {
		assert(this.currentScene._status === 0);
		if(!this.currentScene._isInit) {
			this.currentScene.$init();
		}
		
		//life cycle
		this.currentScene.$pushStatus();
	},
	$unmount: function() {
		//life cycle
		this.currentScene.$pushStatus();
	},
	redirectTo: function(sceneId) {
		var self = this;
		var scene = self.scenes[sceneId];
		assert(scene !== null);

		self.currentScene = scene;

		//redirect thing
		self.$on('hook:left', function() {
			self.$mount();
		});
		self.$unmount();
	}
});

module.exports = X;