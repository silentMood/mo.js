var assert = require('../assert');
var _ = require('../utils');
var event = require('../core_mixins/event');
var compiler = require('../compiler');
var mount = require('../mount');

var router = require('../router');

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

	//config the router
	router.$config(self);

	//start the scene life cycle
	mount.$mount(self.currentScene);
}

X.prototype = _.extend(event, {});

module.exports = X;