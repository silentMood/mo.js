var assert = require('../assert');
var _ = require('../utils');
var base = require('./base');
var event = require('../core_mixins/event');
var compiler = require('../compiler');
var mount = require('../mount');
var Scene = require('./scene');

var router = require('../router');

function generateScenes(root) {
	var tpls = document.querySelectorAll('script[scene]');

	for(var idx = 0; idx < tpls.length; idx++) {
		var tpl = tpls[idx];
		var sceneId = _.getAttrValByName(tpl, 'scene');
		if(root.childs[sceneId]) {
			//warning
			console.log('can not set the same scene id');
			//then ignore this scene
			continue;
		}
		//set app data structure
		root.childs[sceneId] = new Scene({tpl: tpl, root: root, sceneId: sceneId});
		root.childs[sceneId].parent = root;
	}
}

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
	generateScenes(self);

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

X.prototype = _.extend(event, base);

module.exports = X;