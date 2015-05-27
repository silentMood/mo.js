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
Scene.prototype = _.extend(event, lifecycle, {
	$init: function() {
		var self = this;

		self.$on('hook:prepare', function(next) {
			self.$insertEl();
			self.$link()
			next();
		});

		self.$on('hook:ready', function(next){
			self.$runAllFns('hook:readyForDirBehaviour', next);
		});

		self.$on('hook:hold', function(next) {
			self.$runAllFns('hook:holdForDirBehaviour', next);
		});

		self.$on('hook:left', function(next) {
			self.$unlink();
			self.$removeEl();
			next();
		});

		self._isInit = true;
	},
	$link: function() {
		for(var idx = 0; idx < this.fns.length; idx++) {
			this.fns[idx]();
		}
	},
	$unlink: function() {
		for(var idx = 0; idx < this.ufns.length; idx++) {
			this.ufns[idx]();
		}
	},
	$runAllFns: function(eventName, next) {
		var from = 0;
		var to = this.events[eventName].length;
		var cb = function() {
			from++;
			if(from === to) next();
		}
		this.$emit(eventName, cb);
	},
	$insertEl: function() {
		this.parent.container.appendChild(this.el);
	},
	$removeEl: function() {
		this.parent.container.removeChilds();
	}
});

module.exports = Scene;