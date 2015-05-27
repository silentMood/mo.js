(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function(expression) {
	if(!expression) {
		var error = new Error("assert failed");
		throw error;
	}
};
},{}],2:[function(require,module,exports){
var config = require('./config');
var assert = require('./assert');
var Scene = require('./scene');
var Directive = require('./directive');
var _ = require('./utils');

var sceneIdentifier = 'scene';

function linkDirectives(el, scene) {
	assert(scene !== null);

	var attrs = el.attributes;
	for(var i = 0; i < attrs.length; i++) {
		attr = attrs.item(i);
		if(attr.nodeName.match(config.prefix)) {
			var dir = new Directive({
				dirName: attr.nodeName.replace(config.prefix, ''),
				expression: attr.value,
				scene: scene,
				el: el
			});
			//set app data structure
			scene.childs.push(dir);
			dir.parent = scene;
			//set the link fns
			scene.fns.push(dir.bind.bind(dir));
			scene.ufns.push(dir.unbind.bind(dir));
		}
	}
}

function compileDirectives(scene) {
	assert(scene !== null);

	var $nodes = [scene.el];
	while($nodes.length) {
		$el = $nodes[0];
		linkDirectives($el, scene);
		
		$childNodes = $el.childNodes;
		if(!$childNodes.length) {
			$nodes.shift();
			continue;
		}
		for(var i = 0; i < $childNodes.length; i++) {
			if($childNodes[i].nodeType != document.TEXT_NODE) {
				$nodes.push($childNodes[i]);
			}
		}
		$nodes.shift();
	}
}

function compile(el, root) {
	assert(el !== null);
	//compile all the things
	var els = document.querySelectorAll('script[scene]');

	for(var idx = 0; idx < els.length; idx++) {
		var el = els[idx];
		var sceneId = _.getAttrValByName(el, 'scene');
		if(root.childs[sceneId]) {
			//warning
			console.log('can not set the same scene id');
			//then ignore this scene
			continue;
		}
		//set app data structure
		root.childs[sceneId] = new Scene({el: el, root: root});
		root.childs[sceneId].parent = root;
		//start compile the scene function
		compileDirectives(root.childs[sceneId]);
	}
}

module.exports = {
	$compile: compile
};
},{"./assert":1,"./config":3,"./directive":4,"./scene":11,"./utils":12}],3:[function(require,module,exports){
module.exports = {
	prefix: 'd-',
	forceEndTime: 500,
	scenePrefix: 'scene'
};
},{}],4:[function(require,module,exports){
var _ = require('./utils');
var event = require('./event');
var directives = require('./directives/index');

function Directive(opts) {
	assert(opts.expression !== null);
	assert(opts.scene !== null);

	//events container
	this.events = {};

	//directive name
	this.dirName = opts.dirName;
	//directive el
	this.el = opts.el;
	//directive expression
	this.expression = opts.expression;

	//get the link fn and unlink fn
	var dir = directives[this.dirName];
	if(!dir) {
		console.log('can not recognise ' + this.dirName + 'directive');
		this.bind = function(){};
		this.unbind = function(){};
	}
	else {
		assert(dir.bind !== null);
		assert(dir.unbind !== null);

		_.mixin(this, dir);
	}
}

Directive.prototype = _.extend(event, {});

module.exports = Directive;
},{"./directives/index":6,"./event":8,"./utils":12}],5:[function(require,module,exports){
var config = require('../config');
var _ = require('../utils');

go = {
	// handleClick: function() {
	// 	self.parent.$broadcast("TriggerAllElementsLeftTransition");
	// },
	bind: function(expression) {
		// var self = this;
		// //need refactor
		// self.parent.$on("AllElementsLeftTransitionEnd", function() {
		// 	self.parent.$broadcast('ClearAllElementsEnterTransition');
		// 	self.parent.$broadcast('ClearAllElementsLeftTransition');
		// 	self.$dispatch('SceneSwitch', expression);
		// });

		// self.el.addEventListener('click', self.handleClick);
	},
	unbind: function() {
		// this.el.removeEventListener('click', this.handleClick);
		// this.parent.$off('AllElementsLeftTransitionEnd');
	}
}

module.exports = {
  go: go
}
},{"../config":3,"../utils":12}],6:[function(require,module,exports){
var transition = require('./transition');
var go = require('./goto');
var _ = require('../utils');

module.exports = _.extend(transition, go);
},{"../utils":12,"./goto":5,"./transition":7}],7:[function(require,module,exports){
var config = require('../config');
var _ = require('../utils');

var EnterTransMap = {};
var LeftTransMap = {};

AnimationController = {
  handleReady: function(next) {
    var self = this;

    self.triggerTransition(EnterTransMap, next);
  },
  handleHold: function(next) {
    var self = this;

    self.triggerTransition(LeftTransMap, next);
  },
  triggerTransition: function(transitionMap, cb) {
    var self = this;

    var keys = Object.keys(transitionMap).sort();
    if (!keys.length) return cb();
    var idx = 0;
    function go(key) {
      if (idx > keys.length) return cb();
      var transitionendNums = 0;
      transitionMap[key].forEach(function(elem) {
        setTimeout(function() {
          return _.addClass(elem.el, elem.transEffect);
        }, 0);
        var handleEvent = function() {
          transitionendNums++;
          if (transitionendNums === transitionMap[key].length) {
            if (idx <= keys.length) go(keys[idx++]);
          }
        };

        var called = false;
        setTimeout(function() {
          if (called) {
            return;
          }
          called = true;
          handleEvent();
        }, 500);

        elem.el.addEventListener('transitionend', function(e) {
          //once
          elem.el.removeEventListener('transitionend', arguments.callee);

          if (called) {
            return;
          }
          called = true;
          e.stopPropagation();
          return handleEvent();
        });
      });
    };
    return go(keys[idx++]);
  },
  //inject the arguments
  bind: function(expression) {
    //when ready then trigger enter animation
    this.parent.$on('hook:readyForDirBehaviour', this.handleReady.bind(this));
    //when hold then trigger left animation
    this.parent.$on('hook:holdForDirBehaviour', this.handleHold.bind(this));
  },
  unbind: function() {
    self.$off('hook:readyForDirBehaviour', this.handleReady);
    self.$off('hook:holdForDirBehaviour', this.handleHold);
    //reset the map
    EnterTransMap = {};
    LeftTransMap = {};
  }
}

EnterAnimation = {
  bind: function() {
    var priority, transEffect;
    var expression = this.expression;

    priority = expression.split("/")[0];
    transEffect = expression.split("/")[1];
    if (!EnterTransMap[priority]) {
      EnterTransMap[priority] = [];
    }
    EnterTransMap[priority].push({
      el: this.el,
      transEffect: transEffect
    });
  },
  unbind: function() {
    //reset the map
    EnterTransMap = {};
  }
}

LeftAnimation = {
  bind: function() {
    var priority, transEffect;
    var expression = this.expression;

    priority = expression.split("/")[0];
    transEffect = expression.split("/")[1];
    if (!LeftTransMap[priority]) {
      LeftTransMap[priority] = [];
    }
    LeftTransMap[priority].push({
      el: this.el,
      transEffect: transEffect
    });
  },
  unbind: function() {
    //reset the map
    LeftTransMap = {};
  }
}

module.exports = {
  enteranimation: EnterAnimation,
  leftanimation: LeftAnimation,
  animationcontroller: AnimationController
}
},{"../config":3,"../utils":12}],8:[function(require,module,exports){
assert = require('./assert');

module.exports = {
	$on: function(eventName, fn) {
		assert(typeof eventName === 'string');
		assert(typeof fn === 'function');

		//make sure do have the events
		if(!this.events) {
			this.events = {};
		}
		//make sure do have the event queue
		if(!this.events[eventName]) {
			this.events[eventName] = [];
		}

		for(var idx = 0; idx < this.events[eventName].length; idx++) {
			if(fn === this.events[eventName][idx]) {
				//warn
				return console.log('same fn should only bind once');
			}
		}
		this.events[eventName].push(fn);
	},
	$off: function(eventName, fn) {
		assert(typeof eventName === 'string');

		if(!!fn) {
			for(var idx = 0; idx < this.events[eventName].length; idx++) {
				if(fn === this.events[eventName][idx]) {
					//remove the bind fn
					this.events[eventName].splice(idx, idx + 1);
					break;
				}
			}
		} else {
			//remove all the fn
			this.events[eventName] = []
		}
	},
	$emit: function(eventName, info) {
		var fns = this.events[eventName];
		if (fns && fns instanceof Array) {
			fns.forEach(function(fn, idx) {
				fn(info);
			});
		}
	},
	$dispatch: function(eventName, info) {
		var parent = null;
		var scope = this;
		while(parent = scope.parent) {
			scope = parent;
			scope.$emit(eventName, info);
		}
	},
	$broadcast: function(eventName, info) {
		var scopes = [this];
		while(scopes.length) {
			var scope = scopes[0];
			var childs = scope.childs
			for(var i = 0; i < childs.length; i++) {
				childs[i].$emit(eventName, info);
				scopes.push(childs[i]);
			}
			scopes.shift();
		}
	}
}
},{"./assert":1}],9:[function(require,module,exports){
var X = require('./x');

window.X = X;
},{"./x":13}],10:[function(require,module,exports){
//life cycle control
//this means the scene
module.exports = {
	_status: 0,
	$pushStatus: function(err) {
		if(err) {
			//error
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
				//reset status
				this._status = 0;
				//can go
				this.$emit('hook:goto');
				break;
		}
	}
}
},{}],11:[function(require,module,exports){
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
},{"./config":3,"./event":8,"./lifecycle":10,"./utils":12}],12:[function(require,module,exports){
module.exports = {
	extend: function(s, ss) {
		var res = {};
		var args = Array.prototype.slice.call(arguments);
		args.forEach(function(arg) {
			Object.keys(arg).forEach(function(key) {
				res[key] = arg[key];
			});
		});
		return res;
	},
	hasClass: function (el, className) {
  	return !!el.className.match(new RegExp('(\\s|^)'+className+'(\\s|$)'));
	},
	addClass: function (el, className) {
  	if (!this.hasClass(el,className)) el.className += " "+className;
	},
	removeClass: function (el, className) {
	  if (this.hasClass(el,className)) {
	    var reg = new RegExp('(\\s|^)'+className+'(\\s|$)');
	    el.className=el.className.replace(reg,' ');
	  }
	},
	getAttrValByName: function(el, attrName) {
		var attrs = el.attributes;
		for(var i = 0; i < attrs.length; i++) {
			var attr = attrs.item(i);
			if(attr.nodeName.match(attrName)) {
				return attr.value;
			}
		}
	},
	mixin: function(target, source) {
		keys = Object.keys(source);
		for(var idx = 0; idx < keys.length; idx++) {
			var key = keys[idx];
			if(target[key]) {
				continue;
			}
			target[key] = source[key];
		}
	}
}
},{}],13:[function(require,module,exports){
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
		self.$on('hook:goto', function() {
			self.$mount();
		});
		self.$unmount();
	}
});

module.exports = X;
},{"./assert":1,"./compile":2,"./event":8,"./utils":12}]},{},[9])