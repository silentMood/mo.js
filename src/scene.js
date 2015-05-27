var _ = require('./utils');
var event = require('./event');
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
Scene.prototype = _.extend(event, {
	_status: 0,
	$pushStatus: function(err) {
		if(err) {
			return console.log(err);
		}
		var next = arguments.callee.bind(this);
		this._status++;
		switch(this._status) {
			case 1:
				this.$emit('hook:prepare', next);
				break;
			case 2:
				this.$emit('hook:ready', next);
				break;
			case 3:
				this.$emit('hook:go');
				break;
			case 4:
				this.$emit('hook:hold', next);
				break;
			case 5:
				this.$emit('hook:left', next);
				break;
			case 6:
				//when end then reset status
				this._status = 0;
				break;
		}
	},
	$init: function() {
		var self = this;

		self.$on('hook:prepare', function(next) {
			self.$link()
			next();
		});

		self.$on('hook:ready', function(next){
			var from = 0;
			var eventName = 'hook:readyForDirBehaviour'
			var to = self.events[eventName].length;
			var cb = function() {
				from++;
				if(from === to) next();
			}
			self.$emit(eventName, cb);
		});

		self.$on('hook:hold', function(next) {
			var from = 0;
			var eventName = 'hook:holdForDirBehaviour'
			var to = self.events[eventName].length;
			var cb = function() {
				from++;
				if(from === to) next();
			}
			self.$emit(eventName, cb);
			next();
		});

		self.$on('hook:left', function(next) {
			self.$unlink();
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
	}
});

module.exports = Scene;