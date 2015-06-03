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
		if(root.$isSceneIdAlreadyExist(sceneId)) {
			//warning
			console.log('can not set the same scene id');
			//then ignore this scene
			continue;
		}
		//set app data structure
		var scene = new Scene({tpl: tpl, root: root, sceneId: sceneId});
		scene.parent = root;
		root.childs.push(scene);
	}
}

function X(opts) {
	var self = this;
	//events
	self.events = {};
	//create app data structure
	self.childs = self.scenes = [];

	//set total el
	if(!opts || !opts.elId) {
		//error
		return console.log('please spec the elId for stage');
	}
	self.el = document.querySelector('#' + opts.elId);
	if(!self.el) {
		//error
		return console.log('the el did not exist');
	}

	//generate all the scenes
	generateScenes(self);

	//set the main interface
	var attrs = self.el.attributes;
	for(var i = 0; i < attrs.length; i ++) {
		attr = attrs.item(i);
		if(attr.nodeName.match(/main/i)) {
			self.currentScene = self.$getSceneBySceneId(attr.value);
			break;
		}
	}
	if(!self.currentScene) {
		//error
		return console.log('have not set the main interface yet');
	}

	//config the router and mount the main scene
	router.$config(self);
	router.$route(self.currentScene.id);
}

X.prototype = _.extend(event, base, {
	$isSceneIdAlreadyExist: function(sceneId) {
		return !!this.childs.filter(function(child) {
			return child.id === sceneId;
		}).length;
	},
	$getSceneBySceneId: function(sceneId) {
		return this.childs.filter(function(child) {
			return child.id === sceneId;
		})[0];
	}
});

module.exports = X;