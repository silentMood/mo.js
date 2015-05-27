var _ = require('./utils');
var event = require('./event');
var lifecycle = require('./lifecycle');
var config = require('./config');

var baseId = 0;
function generateSceneId() {
	return baseId++;
}

function Scene(opts) {
	var self = this;
	//all the events
	self.events = {};
	//all the dirs
	self.childs = self.dirs = [];
	//sceneId
	self.id = opts.sceneId ? opts.sceneId : generateSceneId();
	//all the link and unlink fns
	self.fns = [];
	self.ufns = [];

	//el
	var el = document.createElement('div');
	el.innerHTML = opts.el.innerHTML;
	self.el = el;
}

//core life cycle
Scene.prototype = _.extend(event, lifecycle);

module.exports = Scene;